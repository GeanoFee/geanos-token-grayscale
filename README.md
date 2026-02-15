# Geano's Token Grayscale

A simple, immersive module for DSA / The Dark Eye that provides immediate visual feedback when a character or creature falls unconscious or dies.

## 🌟 Features

- **Automatic Tinting**: Automatically applies a grayscale tint (#888888) to a token when its Hit Points (`system.LeP.value`) drop to 0 or below.
- **Visual Clarity**: Makes it instantly obvious on the battlemap which combatants are incapacitated.
- **Auto-Restoration**: Removes the tint automatically when Hit Points are restored above 0.

## 📋 System Support
- System agnostic. Working out of the box for systems using `system.LeP.value` for Hit Points (e.g. gdsa), but has a customizable path in the settings to work with every system.

## 🚀 Installation

- **Manifest URL**: `https://github.com/GeanoFee/geanos-token-grayscale/releases/latest/download/module.json`

---
## License
This module is licensed under the [MIT License](LICENSE).

