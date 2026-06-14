import { CONFIG } from '../core/config.js';

export class AI {
    constructor(difficulty = 'MEDIUM') {
        this.setDifficulty(difficulty);
        this.reactionCounter = 0;
        this.targetY = CONFIG.CANVAS.HEIGHT / 2;
    }

    setDifficulty(difficulty) {
        const config = CONFIG.AI_DIFFICULTY[difficulty];
        this.speed = config.speed;
        this.reactionDelay = config.reactionDelay;
        this.accuracy = config.accuracy;
        this.predictTrajectory = config.predictTrajectory;
    }

    update(paddle, ball, planets) {
        this.reactionCounter++;

        if (this.reactionCounter >= this.reactionDelay) {
            this.reactionCounter = 0;
            this.calculateTarget(ball, planets);
        }

        const paddleCenter = paddle.y + paddle.height / 2;
        const difference = this.targetY - paddleCenter;

        if (Math.abs(difference) > 10) {
            if (difference > 0) {
                paddle.update(1);
            } else {
                paddle.update(-1);
            }
        } else {
            paddle.update(0);
        }
    }

    calculateTarget(ball, planets) {
        if (ball.velocityX < 0) {
            this.targetY = CONFIG.CANVAS.HEIGHT / 2;
            return;
        }

        if (this.predictTrajectory) {
            this.targetY = this.predictBallPosition(ball, planets);
        } else {
            this.targetY = ball.y;
        }

        if (Math.random() > this.accuracy) {
            this.targetY += (Math.random() - 0.5) * 100;
        }

        this.targetY = Math.max(50, Math.min(CONFIG.CANVAS.HEIGHT - 50, this.targetY));
    }

    predictBallPosition(ball, planets) {
        const simBall = {
            x: ball.x,
            y: ball.y,
            velocityX: ball.velocityX,
            velocityY: ball.velocityY,
            radius: ball.radius
        };

        const maxSteps = 120;
        let steps = 0;

        while (simBall.x < CONFIG.CANVAS.WIDTH - 100 && steps < maxSteps) {
            planets.forEach(planet => {
                if (planet.isDisabled) return;

                const dx = planet.x - simBall.x;
                const dy = planet.y - simBall.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < planet.radius * 3) {
                    const force = planet.gravityStrength / (distance * distance) * 1000;
                    const angle = Math.atan2(dy, dx);

                    simBall.velocityX += Math.cos(angle) * force;
                    simBall.velocityY += Math.sin(angle) * force;
                }
            });

            simBall.x += simBall.velocityX;
            simBall.y += simBall.velocityY;

            if (simBall.y - simBall.radius <= 0 ||
                simBall.y + simBall.radius >= CONFIG.CANVAS.HEIGHT) {
                simBall.velocityY *= -1;
            }

            steps++;
        }

        return simBall.y;
    }
}
