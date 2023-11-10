# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import subprocess
# import os

# app = Flask(__name__)
# CORS(app)

# @app.route('/process-input', methods=['POST'])
# def process_input():
    
#     input_value = request.form.get('inputValue')
#     file = request.form.get('file')

#     print(file)

#     if os.path.exists(file):
#         print("File path:", file)

#         # Run the subprocess with the file path
#         result = subprocess.run(["python", "edr_temp.py", input_value, file], capture_output=True, text=True)

#         return jsonify({"output": result.stdout, "error": None})
#     else:
#         return jsonify({"output": None, "error": "File path does not exist"}), 400

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

@app.route('/process-input', methods=['POST'])
def process_input():
    try:
        selected_filter = request.form.get('selected_filter')
        input_value = request.form.get('input_value')
        file = request.form.get('file')

        if file and os.path.exists(file):
            print("selected_filter:", selected_filter)
            print("input_value:", input_value) 
            print("File path:", file)

            # Run the subprocess with the file path
            result = subprocess.run(["python", "edr_temp.py", selected_filter, input_value, file], capture_output=True, text=True)

            return jsonify({"output": result.stdout, "error": None})
        else:
            return jsonify({"output": None, "error": "File path does not exist"}), 400

    except Exception as e:
        return jsonify({"output": None, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
