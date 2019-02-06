import requests

class REST():

    @staticmethod
    def _url(path):
        return 'http://localhost:3010' + path

    @staticmethod
    def get_mesos():
        return requests.get(REST._url('/meso/gasnames'))

    @staticmethod
    def add_meso(mittajson):
        return requests.post(REST._url('/meso/create'), mittajson)
