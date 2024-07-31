import os
from werkzeug.utils import secure_filename

def get_file_path(file, order):
    
    file_path = None
    
    basedir = os.path.join(os.getcwd(), 'uploads')
    
    if not os.path.exists(basedir):
        os.makedirs(basedir)

    if file and file.filename != '':
        file_filename = secure_filename(file.filename)
        file_path = os.path.join(basedir, f'{order}_{file_filename}')
        file.save(file_path)
    
    return file_path

def delete_file(file_path):
    try:
        if os.path.isfile(file_path):
            os.remove(file_path)
            return True
        else:
            return False
    except Exception as e:
        print(f"Error al eliminar el archivo: {e}")
        return False