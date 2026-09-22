// Add future blocks here; providers and application effects stay independent.
export const INPUTS = [
  { id: "simulator", name: "Muse 2", subtitle: "EEG · simulated device" },
];
export const DETECTORS = [
  {
    id: "eyes_closed",
    name: "Eyes Closed",
    description: "When alpha activity rises",
  },
];
export const ACTIONS = [
  {
    id: "jump",
    name: "Jump",
    icon: "↥",
    description: "Give your newt a little lift",
    code: "player.jump()",
  },
  {
    id: "boost",
    name: "Boost",
    icon: "»",
    description: "A burst of forward momentum",
    code: "player.boost()",
  },
  {
    id: "shoot",
    name: "Shoot",
    icon: "⌁",
    description: "Send a pulse across the scene",
    code: "player.shoot()",
  },
  {
    id: "move_up",
    name: "Move Up",
    icon: "↑",
    description: "Rise to a higher flight path",
    code: "player.moveUp()",
  },
  {
    id: "change_color",
    name: "Change Color",
    icon: "◐",
    description: "Give your newt a new color",
    code: "player.changeColor()",
  },
  {
    id: "play_sound",
    name: "Play Sound",
    icon: "♫",
    description: "Turn a signal into a short tone",
    code: "player.playSound()",
  },
];
