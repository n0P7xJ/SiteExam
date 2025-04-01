const photoInput = document.getElementById('photo');
const editPhotoContainer = document.getElementById('editPhotoContainer');
const editCanvas = document.getElementById('editCanvas');
const rotateLeftBtn = document.getElementById('rotateLeft');
const rotateRightBtn = document.getElementById('rotateRight');
const cropBtn = document.getElementById('crop');
const resultContainer = document.getElementById('resultContainer');
const resultPhoto = document.getElementById('resultPhoto');
const form = document.getElementById('registrationForm');

let image = new Image();
let rotation = 0;
let ctx = editCanvas.getContext('2d');

// Завантаження фото
photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            image.src = event.target.result;
            image.onload = () => {
                editPhotoContainer.classList.remove('hidden');
                drawImage();
            };
        };
        reader.readAsDataURL(file);
    }
});

// Малювання зображення на canvas
function drawImage() {
    const size = Math.min(image.width, image.height, 300); // Обмежуємо розмір
    editCanvas.width = size;
    editCanvas.height = size;
    
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
}

// Поворот вліво
rotateLeftBtn.addEventListener('click', () => {
    rotation -= 90;
    drawImage();
});


rotateRightBtn.addEventListener('click', () => {
    rotation += 90;
    drawImage();
});

cropBtn.addEventListener('click', () => {
    const size = Math.min(image.width, image.height);
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    
    croppedCanvas.width = size;
    croppedCanvas.height = size;
    
    croppedCtx.translate(size / 2, size / 2);
    croppedCtx.rotate((rotation * Math.PI) / 180);
    croppedCtx.drawImage(image, -image.width / 2, -image.height / 2);
    
    resultPhoto.src = croppedCanvas.toDataURL();
    resultContainer.classList.remove('hidden');
    editPhotoContainer.classList.add('hidden');
});


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    console.log('Реєстрація:', { username, email, photo: resultPhoto.src });
    alert('Реєстрація успішна!');
});