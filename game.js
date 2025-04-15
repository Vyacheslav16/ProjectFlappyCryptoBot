const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let score = 0;
let isGameOver = false;

// Птичка
const bird = {
    x: 50,
    y: 300,
    width: 40,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jump: -10,
};

// Трубы
const pipes = [];
let pipeTimer = 0;

function gameLoop() {
    update();
    draw();
    if (!isGameOver) requestAnimationFrame(gameLoop);
}

function update() {
    // Движение птички
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Генерация труб
    pipeTimer++;
    if (pipeTimer > 100) {
        pipes.push({
            x: canvas.width,
            height: Math.random() * 200 + 100,
            gap: 150,
            passed: false,
        });
        pipeTimer = 0;
    }

    // Обновление труб
    pipes.forEach((pipe, index) => {
        pipe.x -= 2;
        if (pipe.x + 50 < 0) pipes.splice(index, 1);
    });

    // Проверка столкновений
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
}

function draw() {
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем птичку
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Рисуем трубы
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 50, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + pipe.gap, 50, canvas.height);
    });

    // Очки
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function endGame() {
    isGameOver = true;
    alert(`Game Over! Score: ${score}`);
    sendTokensToWallet(score); // Отправляем токены
}

// Прыжок по клику
document.addEventListener("click", () => {
    if (isGameOver) resetGame();
    else bird.velocity = bird.jump;
});

function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    isGameOver = false;
    gameLoop();
}

gameLoop();