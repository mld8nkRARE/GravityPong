// js/utils/Physics.js

class Physics {
    static applyPlanetGravity(ball, planets) {
        const minDistance = 50;

        planets.forEach(planet => {
            const dx = planet.x - ball.x;
            const dy = planet.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Не притягиваем, если мяч уже на планете
            //if (distance < minDistance) return;

            const effectiveRadius = planet.radius * planet.gravityStrength;

            if (distance < effectiveRadius) {
                const nx = dx / distance;
                const ny = dy / distance;

                // Плавное ослабление силы к краю поля
                const distanceFactor = 1 - (distance / effectiveRadius);

                // СУЩЕСТВЕННО СНИЗИЛИ СИЛУ (умножаем на 0.05 вместо прежних 0.4)
                const baseForce = planet.gravity * distanceFactor * 0.45;

                ball.velocityX += nx * baseForce;
                ball.velocityY += ny * baseForce;
            }
        });
    }

    static limitSpeed(ball) {
        if (ball.isFrozen) {
            return; // Не ограничиваем скорость если заморожено
        }
        const minSpeed = CONFIG.BALL.MIN_SPEED;
        const maxSpeed = CONFIG.BALL.MAX_SPEED;

        let currentSpeed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);

        if (currentSpeed > maxSpeed) {
            const scale = maxSpeed / currentSpeed;
            ball.velocityX *= scale;
            ball.velocityY *= scale;
        } else if (currentSpeed < minSpeed && currentSpeed > 0) {
            const scale = minSpeed / currentSpeed;
            ball.velocityX *= scale;
            ball.velocityY *= scale;
        }

        // ЗАЩИТА ОТ ВЕРТИКАЛЬНОГО ЗАСТРЕВАНИЯ:
        // Горизонтальная скорость мяча не должна падать ниже 2.5 единиц
        const minHorizontalSpeed = 2.5;
        if (Math.abs(ball.velocityX) < minHorizontalSpeed) {
            const direction = ball.velocityX >= 0 ? 1 : -1;
            ball.velocityX = direction * minHorizontalSpeed;

            // Пересчитываем скорость, чтобы мяч не ускорился сверх меры
            currentSpeed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
            const scale = minSpeed / currentSpeed;
            ball.velocityX *= scale;
            ball.velocityY *= scale;
        }
    }

    static checkPaddleCollision(ball, paddle) {
        const bounds = paddle.getBounds();

        if (ball.x + ball.radius > bounds.left &&
            ball.x - ball.radius < bounds.right &&
            ball.y + ball.radius > bounds.top &&
            ball.y - ball.radius < bounds.bottom) {

            if (window.audioManager) {
                window.audioManager.playSound('paddleHit');
            }

            const relativeY = (ball.y - bounds.centerY) / (paddle.height / 2);
            const maxAngle = Math.PI / 3; // 60 градусов
            const angle = relativeY * maxAngle;

            const currentSpeed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);

            // Умножаем на процент ускорения мяча из настроек
            let newSpeed = currentSpeed * SETTINGS.speedIncrease;
            newSpeed = Math.min(newSpeed, CONFIG.BALL.MAX_SPEED);

            const direction = ball.x < CONFIG.CANVAS.WIDTH / 2 ? 1 : -1;

            ball.velocityX = direction * newSpeed * Math.cos(angle);
            ball.velocityY = newSpeed * Math.sin(angle);

            if (direction === 1) {
                ball.x = bounds.right + ball.radius + 1;
            } else {
                ball.x = bounds.left - ball.radius - 1;
            }

            ball.lastHitPaddle = paddle;
            return true;
        }
        return false;
    }

    static checkGoal(ball) {
        if (ball.x - ball.radius < 0) return 'player2';
        if (ball.x + ball.radius > CONFIG.CANVAS.WIDTH) return 'player1';
        return null;
    }
}

window.Physics = Physics;