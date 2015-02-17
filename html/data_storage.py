import web
import json


class DataStorage:
    @staticmethod
    def process_request(data):

        try:
            request = json.loads(data)
            print "DataStorage.process_request("+data+")"
        except:
            response = json.dumps({'result': 'ERROR', 'data': "cannot decode JSON request:"+data})
            print response
            return response

        if request["request"] == "read":
            try:
                f = open(request["filename"], 'r')
                print "file "+request["filename"]+" opened"
                text = f.read()
                print "file "+request["filename"]+" read"
                f.close()
                print "file "+request["filename"]+" closed"
                try:
                    out_data = json.loads(text)
                except:
                    print "file is not JSON, so reading as text"
                    out_data = text
                response = json.dumps({'result': 'OK', 'data': out_data})
                print response
                return response
            except:
                response = json.dumps({'result': 'ERROR', 'data': "not found "+request["filename"]})
                print response
                return response

        if request["request"] == "write":
            try:
                f = open(request["filename"], 'w')
                print "file "+request["filename"]+" opened"
                try:
                    text = json.dumps(request["data"])
                except:
                    text = request["data"]
                f.write(text)
                print "file "+request["filename"]+" written"
                f.close()
                print "file "+request["filename"]+" closed"
                out_data = "file "+request["filename"]+" saved"
                response = json.dumps({'result': 'OK', 'data': out_data})
                print response
                return response
            except:
                response = json.dumps({'result': 'ERROR', 'data': "cannot save "+request["filename"]})
                print response
                return response


urls = (
    '/(.*)', 'web_page',
)


class web_page:
    def GET(self, name):
        print "GET /"+name
        try:
            f = open(name, 'r')
            print "reading file "+name+" ..."
            text = f.read()
            f.close()
        except:
            text = "no such file "+name
            print text
        return text

    def POST(self, data):
        print "POST /"+data
        try:
            params = data[data.find('{'):]
            return DataStorage.process_request(params)
        except:
            response = json.dumps({'result': 'ERROR', 'data': "incorrect request"})
            return response

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()