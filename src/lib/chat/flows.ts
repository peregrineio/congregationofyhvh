import { Flow, FlowInput, FlowState, FlowStep, LeadInfo } from "./types";

/**
 * Guided flows (Typebot-style block model, plain reducer).
 * Buttons first, contact last, every step skippable — a visitor reaching
 * out to a congregation should never feel processed.
 *
 * The "done" steps deliberately promise nothing about follow-up. Whether
 * the message actually reached the congregation is only known after the
 * send, so ChatWidget reports that honestly once the request returns.
 */

const EMAIL_RE = /\S+@\S+\.\S+/;
const PHONE_RE = /(\+?\d[\d\s().-]{6,})/;

export function isValidContact(value: string): boolean {
  return EMAIL_RE.test(value) || PHONE_RE.test(value);
}

export const visitFlow: Flow = {
  id: "visit",
  start: "when",
  steps: {
    when: {
      id: "when",
      say: ["We'd love to have you! 🕯️ A couple of quick questions so we can look out for you.", "When are you thinking of visiting?"],
      input: {
        type: "buttons",
        slot: "visitWhen",
        options: ["This Shabbat", "In the next few weeks", "Just exploring"],
      },
      next: "party",
    },
    party: {
      id: "party",
      say: ["Wonderful. Who's coming with you?"],
      input: {
        type: "buttons",
        slot: "party",
        options: ["Just me", "Me and my family", "A small group"],
      },
      next: "name",
    },
    name: {
      id: "name",
      say: [
        "Service is every Shabbat (Saturday) at **3:00 PM**, and if you're bringing little ones there's a children's service from **2:00 to 2:45 PM**.",
        "Who should we look out for?",
      ],
      input: { type: "text", slot: "name", placeholder: "Your first name" },
      next: "contact",
    },
    contact: {
      id: "contact",
      say: ["Thanks {name}! What's the best email or phone number, in case anything changes? (Or type \"skip\".)"],
      input: {
        type: "contact",
        slot: "contact",
        placeholder: "Email or phone",
        retry: "Hmm, that doesn't look like an email or phone number — mind double-checking? (Or type \"skip\".)",
      },
      next: "done",
    },
    done: {
      id: "done",
      say: ["Thank you, {name}! We look forward to meeting you. 🙏"],
    },
  },
  submitWithout: "name",
};

export const prayerFlow: Flow = {
  id: "prayer",
  start: "request",
  steps: {
    request: {
      id: "request",
      say: [
        "I'd be honored to pass your prayer request to the congregation. 🙏",
        "What would you like prayer for? Share only what you're comfortable sharing.",
      ],
      input: { type: "text", slot: "prayer", placeholder: "Your prayer request", freeText: true },
      next: "name",
    },
    name: {
      id: "name",
      say: ["Thank you for trusting us with that. What name should we pray for? (A first name is fine — or type \"anonymous\".)"],
      input: { type: "text", slot: "name", placeholder: "First name or \"anonymous\"" },
      next: "contact",
    },
    contact: {
      id: "contact",
      say: ["Would you like someone to reach out to you? Leave an email or phone number — or type \"skip\"."],
      input: {
        type: "contact",
        slot: "contact",
        placeholder: "Email or phone (optional)",
        retry: "That doesn't look like an email or phone number — mind double-checking? (Or type \"skip\".)",
      },
      next: "done",
    },
    done: {
      id: "done",
      say: ["Thank you, {name}. You are not alone in this. 🙏"],
    },
  },
  submitWithout: "prayer",
};

export const humanFlow: Flow = {
  id: "human",
  start: "name",
  steps: {
    name: {
      id: "name",
      say: ["Of course — I'll pass your message to someone from the congregation. Who should they ask for?"],
      input: { type: "text", slot: "name", placeholder: "Your first name" },
      next: "contact",
    },
    contact: {
      id: "contact",
      say: ["Thanks {name}. What's the best email or phone number to reach you?"],
      input: {
        type: "contact",
        slot: "contact",
        placeholder: "Email or phone",
        retry: "That doesn't look like an email or phone number — mind double-checking?",
      },
      next: "topic",
    },
    topic: {
      id: "topic",
      say: ["Got it. What would you like to talk about? (Or tap skip.)"],
      input: { type: "text", slot: "topic", placeholder: "What's this about?", freeText: true },
      next: "done",
    },
    done: {
      id: "done",
      say: ["Thank you, {name}."],
    },
  },
};

const flows: Record<string, Flow> = {
  [visitFlow.id]: visitFlow,
  [prayerFlow.id]: prayerFlow,
  [humanFlow.id]: humanFlow,
};

export function getFlow(id: string): Flow | undefined {
  return flows[id];
}

export function startFlow(flowId: string): FlowState {
  const flow = flows[flowId];
  return { flowId, stepId: flow.start, slots: {}, retried: false };
}

export function getStep(state: FlowState): FlowStep {
  return flows[state.flowId].steps[state.stepId];
}

export function interpolate(text: string, slots: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => slots[key] ?? "");
}

export interface FlowAdvance {
  state: FlowState | null; // null when flow is finished
  /** Bot bubbles to send (already interpolated) */
  say: string[];
  /** Input config for the next step (buttons/placeholder), if any */
  input?: FlowStep["input"];
  /** True when validation failed and we're re-asking */
  retrying: boolean;
  /** Set when the flow completed — send this to the congregation */
  completedLead?: LeadInfo;
}

/** Opening bubbles + input for a freshly started flow. */
export function enterFlow(state: FlowState): FlowAdvance {
  const step = getStep(state);
  return {
    state,
    say: step.say.map((s) => interpolate(s, state.slots)),
    input: step.input,
    retrying: false,
  };
}

const SKIP_WORDS = new Set(["skip", "cancel", "no thanks", "nevermind", "never mind", "stop", "exit"]);

/** Enough has been shared to be worth sending, even if the rest is skipped. */
function hasSubmittable(state: FlowState): boolean {
  if (state.slots.contact) return true;
  const key = flows[state.flowId].submitWithout;
  return Boolean(key && state.slots[key]);
}

/**
 * Feed a user answer into the flow. Returns the next bubbles + input.
 * "skip"/"cancel" exits the flow gracefully. Validation gets ONE retry,
 * then the answer is accepted as-is — chat must never become a trap.
 */
export function advanceFlow(state: FlowState, answer: string): FlowAdvance | { exited: true } {
  const trimmed = answer.trim();
  if (SKIP_WORDS.has(trimmed.toLowerCase())) {
    // Skipping an optional tail question still completes the flow when
    // enough has been shared; otherwise it exits.
    if (hasSubmittable(state)) {
      return finishFrom(state);
    }
    return { exited: true };
  }

  const step = getStep(state);
  const input = step.input;

  if (input) {
    // Validate once; second attempt passes through — never trap the user
    const retryMessage = validateInput(input, trimmed);
    if (retryMessage && !state.retried) {
      return {
        state: { ...state, retried: true },
        say: [retryMessage],
        input,
        retrying: true,
      };
    }
    state = {
      ...state,
      slots: { ...state.slots, [input.slot]: trimmed },
      retried: false,
    };
  }

  if (!step.next) return finishFrom(state);

  const nextState: FlowState = { ...state, stepId: step.next };
  const nextStep = getStep(nextState);
  const result: FlowAdvance = {
    state: nextStep.input || nextStep.next ? nextState : null,
    say: nextStep.say.map((s) => interpolate(s, nextState.slots)),
    input: nextStep.input,
    retrying: false,
  };
  // Terminal step with no input → flow is complete
  if (!nextStep.input && !nextStep.next) {
    result.state = null;
    result.completedLead = leadFromState(nextState);
  }
  return result;
}

/** Returns a retry message when the answer doesn't fit the slot, else null. */
function validateInput(input: FlowInput, value: string): string | null {
  if (input.type === "contact" && !isValidContact(value)) {
    return input.retry ?? "Mind double-checking that?";
  }
  if (input.slot === "name" && (value.length > 40 || value.split(/\s+/).length > 4 || value.includes("?"))) {
    return "Just a first name is perfect 🙂";
  }
  return null;
}

function finishFrom(state: FlowState): FlowAdvance {
  const name = state.slots.name;
  return {
    state: null,
    say: [name ? `Thank you, ${name}.` : "Thank you."],
    retrying: false,
    completedLead: leadFromState(state),
  };
}

function leadFromState(state: FlowState): LeadInfo {
  const { slots } = state;
  return {
    flow: state.flowId,
    name: slots.name,
    contact: slots.contact,
    visitWhen: slots.visitWhen,
    party: slots.party,
    topic: slots.topic,
    prayer: slots.prayer,
  };
}
