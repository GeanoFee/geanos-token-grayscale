
const MODULE_ID = "geanos-token-grayscale";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class TokenGrayscaleSettings extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    id: `${MODULE_ID}-settings`,
    classes: [MODULE_ID],
    window: {
      title: "Geano's Token Grayscale Settings",
      icon: "fas fa-skull",
      resizable: false,
    },
    position: {
      width: 400,
      height: "auto",
    },
    form: {
      handler: TokenGrayscaleSettings.formHandler,
      submitOnChange: false,
      closeOnSubmit: true,
    },
    actions: {
      reset: TokenGrayscaleSettings.resetSettings,
    },
  };

  static PARTS = {
    form: {
      template: `modules/${MODULE_ID}/templates/settings.html`,
    },
  };

  async _prepareContext(_options) {
    return {
      hpPath: game.settings.get(MODULE_ID, "hpPath"),
      deadColor: game.settings.get(MODULE_ID, "deadColor"),
      threshold: game.settings.get(MODULE_ID, "threshold"),
    };
  }

  static async formHandler(event, form, formData) {
    const object = formData.object;
    await game.settings.set(MODULE_ID, "hpPath", object.hpPath);
    await game.settings.set(MODULE_ID, "deadColor", object.deadColor);
    await game.settings.set(MODULE_ID, "threshold", object.threshold);
  }

  static async resetSettings() {
    await game.settings.set(MODULE_ID, "hpPath", "system.LeP.value");
    await game.settings.set(MODULE_ID, "deadColor", "#888888");
    await game.settings.set(MODULE_ID, "threshold", 0);
    this.render();
  }
}

class TokenGrayscaleModule {
  static init() {
    // Register Settings
    game.settings.register(MODULE_ID, "hpPath", {
      name: "HP Attribute Path",
      hint: "The data path to the Hit Points attribute (e.g., system.attributes.hp.value or system.LeP.value).",
      scope: "world",
      config: false,
      type: String,
      default: "system.LeP.value",
    });

    game.settings.register(MODULE_ID, "deadColor", {
      name: "Dead Tint Color",
      hint: "The hex color code to tint the token when HP is 0 or less.",
      scope: "world",
      config: false,
      type: String,
      default: "#888888",
    });

    game.settings.register(MODULE_ID, "threshold", {
      name: "HP Threshold",
      hint: "Tokens with HP less than or equal to this value will be grayscaled.",
      scope: "world",
      config: false,
      type: Number,
      default: 0,
    });


    // Register Menu
    game.settings.registerMenu(MODULE_ID, "settingsMenu", {
      name: "Token Grayscale Configuration",
      label: "Configure",
      icon: "fas fa-cog",
      type: TokenGrayscaleSettings,
      restricted: true,
    });
  }

  static onUpdateActor(actor, data, options, userId) {
    const hpPath = game.settings.get(MODULE_ID, "hpPath");
    const newHP = foundry.utils.getProperty(data, hpPath);

    if (newHP === undefined) return;

    const deadColor = game.settings.get(MODULE_ID, "deadColor");
    const threshold = game.settings.get(MODULE_ID, "threshold");

    const isDead = newHP <= threshold;
    const updateData = {
      "texture.tint": isDead ? typeof Color !== "undefined" ? Color.from(deadColor).css : deadColor : null
    };

    for (const token of actor.getActiveTokens()) {
      if (!token.document) continue;
      token.document.update(updateData);
    }
  }
}

Hooks.once("init", TokenGrayscaleModule.init);
Hooks.on("updateActor", TokenGrayscaleModule.onUpdateActor);
