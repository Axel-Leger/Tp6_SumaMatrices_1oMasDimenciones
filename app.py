from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sumar-matrices', methods=['POST'])
def sumar_matrices():
    try:
        data = request.get_json()
        
        # Convertir las matrices a arrays de NumPy
        matriz1 = np.array(data['matriz1'], dtype=float)
        matriz2 = np.array(data['matriz2'], dtype=float)

        # Validar dimensiones
        if matriz1.shape != matriz2.shape:
            return jsonify({
                'error': f'Las matrices deben tener las mismas dimensiones. '
                         f'Matriz 1: {matriz1.shape}, Matriz 2: {matriz2.shape}'
            }), 400

        # Realizar la suma con NumPy
        resultado = np.add(matriz1, matriz2)

        # Convertir el resultado a lista para JSON
        return jsonify({
            'resultado': resultado.tolist(),
        })

    except ValueError as e:
        return jsonify({
            'error': 'Error en los datos de entrada',
            'detalle': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Error al procesar las matrices',
            'detalle': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)