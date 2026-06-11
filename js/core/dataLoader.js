// js/utils/DataLoader.js

class DataLoader {
    constructor() {
        this.data = null;
        this.isLoaded = false;
    }

    async loadRules() {
        try {
            // Можно использовать относительный путь или абсолютный
            const response = await fetch('/assets/data/rules.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.data = await response.json();
            this.isLoaded = true;

            console.log('Правила игры успешно загружены:', this.data);
            return this.data;

        } catch (error) {
            console.warn('Не удалось загрузить rules.json, используем локальные данные', error);

            // Fallback — локальные данные
            this.data = {
                gameTitle: "GRAVITY PONG",
                version: "1.0",
                description: "Игра загружена в оффлайн-режиме.",
                rules: [
                    "Управляйте ракеткой с помощью клавиш",
                    "Используйте подсказки для преимущества",
                    "Побеждает тот, кто первым уничтожит все жизни противника"
                ]
            };
            this.isLoaded = true;
            return this.data;
        }
    }

    getRules() {
        return this.data;
    }

    getDescription() {
        return this.data ? this.data.description : "Описание недоступно";
    }

    getRulesList() {
        return this.data && this.data.rules ? this.data.rules : [];
    }
}

// Глобально
window.DataLoader = DataLoader;