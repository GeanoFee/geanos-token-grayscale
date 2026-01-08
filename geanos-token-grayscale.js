
Hooks.on("updateActor", (actor, data, options, userId) => {
  const hpPath = "system.LeP.value";
  const newHP = getProperty(data, hpPath);
  if (newHP === undefined) return;

  for (let token of actor.getActiveTokens()) {
    if (!token || !token.document || !token.document._id) continue;
    const isDead = newHP <= 0;

    // Aktuellen Token-Effekt setzen
    token.document.update({ "texture.tint": isDead ? "#888888" : null });
  }
});
