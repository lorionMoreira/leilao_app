import requests
import schedule
import time
import pymysql
from datetime import datetime 


def obter_horarios_do_banco():
    # Estabelecer conexão com o banco de dados
    conexao = pymysql.connect(host='127.0.0.1', user='concentrador', password='Nova15423', database='urna_database')

    try:
        with conexao.cursor() as cursor:
            # Executar o SELECT para obter os horários
            cursor.execute('SELECT data_abertura,uuid FROM `salas` WHERE 1')
            resultados = cursor.fetchall()  # Obter os resultados do SELECT
            horarios_uuid = [{'horario': resultado[0], 'uuid': resultado[1]} for resultado in resultados]

    finally:
        conexao.close()

    return horarios_uuid

# Função para chamar a API
# Função para chamar a API
def chamar_api(uuid):
    # URL da API que será chamada
    api_url = 'http://localhost:8080/login'

    # JSON data for the POST request body
    #in python this is a dictionary
    post_data = {
        "email": "nelio.iftm@gmail.com",
        "senha": "123"
    }
    # Convert the data to JSON format
    post_data_json = json.dumps(post_data)

    # Fazer a requisição à API
    response = requests.post(api_url,data=post_data_json)
    
    # Verificar se a requisição foi bem-sucedida
    if response.status_code == 200:
        print('API chamada com sucesso.')
        authorization_header = response.headers.get('Authorization')

        # Set the Authorization header for the GET request
        headers = {'Authorization': authorization_header}
        api_url2 = f'http://localhost:8080/api/salas/send-message/{uuid}'
        # Make a GET request with the Authorization header
        get_response = requests.get(api_url2, headers=headers)
        print(get_response)
    else:
        print('Falha ao chamar a API. Código de status:', response.status_code)

def set_schedule(horarios_uuid):
    # Agendar a chamada à API nos horários obtidos
    for item in horarios_uuid:

        horario = item['horario']
        uuid = item['uuid']

        time_difference = horario - datetime.now()

        if time_difference.days < 0:
            continue

        time_difference_seconds = max(0, time_difference.total_seconds())

        # Schedule the job to run after the calculated time difference
        schedule.every(time_difference_seconds).seconds.do(lambda: chamar_api(uuid))


if __name__ == '__main__':
    # Obter os horários do banco de dados
    horarios_uuid = obter_horarios_do_banco()

    set_schedule(horarios_uuid)

    # Loop para verificar e executar as tarefas agendadas
    while True:
        schedule.run_pending()
        time.sleep(1)