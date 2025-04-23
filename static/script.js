let filas = 0;
let columnas = 0;

function crearMatrices() {
    filas = parseInt(document.getElementById('filas').value);
    columnas = parseInt(document.getElementById('columnas').value);
    
    if (isNaN(filas) || isNaN(columnas) || filas < 1 || columnas < 1) {
        alert('Por favor ingrese valores válidos para filas y columnas');
        return;
    }
    
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    
    crearInputsMatriz('matriz1-container', 'm1');
    crearInputsMatriz('matriz2-container', 'm2');
}

function crearInputsMatriz(containerId, prefix) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `${prefix}-${i}-${j}`;
            input.placeholder = `Fila ${i+1}, Col ${j+1}`;
            input.step = 'any';  // Permite decimales
            container.appendChild(input);
        }
        container.appendChild(document.createElement('br'));
    }
}

function validarYEnviar() {
    const matriz1 = obtenerMatriz('m1');
    const matriz2 = obtenerMatriz('m2');
    
    if (!matriz1 || !matriz2) return;
    
    fetch('/sumar-matrices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matriz1, matriz2 }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`${data.error}\n${data.detalle || ''}`);
        } else {
            mostrarResultado(data.resultado, data.detalle);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al procesar las matrices');
    });
}

function obtenerMatriz(prefix) {
    const matriz = [];
    for (let i = 0; i < filas; i++) {
        const fila = [];
        for (let j = 0; j < columnas; j++) {
            const valor = document.getElementById(`${prefix}-${i}-${j}`).value;
            if (valor === '') {
                alert(`Por favor complete todos los valores (Fila ${i+1}, Columna ${j+1})`);
                return null;
            }
            fila.push(valor);
        }
        matriz.push(fila);
    }
    return matriz;
}

function mostrarResultado(matriz, detalle) {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    
    const resultadoContainer = document.getElementById('resultado-container');
    resultadoContainer.innerHTML = '';
    
    const tabla = document.createElement('table');
    tabla.border = '1';
    
    for (let i = 0; i < matriz.length; i++) {
        const fila = document.createElement('tr');
        for (let j = 0; j < matriz[i].length; j++) {
            const celda = document.createElement('td');
            celda.textContent = matriz[i][j];
            celda.style.padding = '5px';
            celda.style.textAlign = 'center';
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    
    resultadoContainer.appendChild(tabla);
    
    if (detalle) {
        document.getElementById('detalle-operacion').textContent = detalle;
    }
}

function resetear() {
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
    document.getElementById('filas').value = '';
    document.getElementById('columnas').value = '';
    document.getElementById('detalle-operacion').textContent = '';
}