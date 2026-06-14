export class DataLoader {
    constructor() {
        this.data = null;
    }

    async loadRules() {
        try {
            const response = await fetch('assets/data/rules.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.data = await response.json();

            return this.data;

        } catch (error) {
            this.data = {
                gameTitle: "GRAVITY PONG",
                version: "1.0",
                description: "Игра загружена в оффлайн-режиме.",
                rules: [
                    "Управляйте ракеткой с помощью клавиш",
                    "Используйте подсказки для преимущества",
                    "Побеждает тот, кто первым забьет 5 мячей"
                ]
            };
            return this.data;
        }
    }

    getRules() {
        return this.data;
    }

    getRulesList() {
        return this.data && this.data.rules ? this.data.rules : [];
    }
}
