import { registerJingjingPet } from "./pet/jingjing-pet.js";

export function initAssistant(spriteUrl) {
  registerJingjingPet();
  const pet = document.createElement("jingjing-pet");
  pet.setAttribute("src", spriteUrl);
  pet.setAttribute("storage-key", "chunhezi-pet-preferences-v1");
  document.querySelector("#petHost").append(pet);
  return () => pet.remove();
}
