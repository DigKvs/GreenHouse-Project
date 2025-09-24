from machine import Pin, ADC
import time
import network
import urequests
import ujson
import dht
import socket

#Credenciais do WIFI
nome = "123456"
senha = "Senha123"

# Endereço do firebase
FIREBASE_URL = "https://greengarden-fd823-default-rtdb.firebaseio.com"
SECRET_KEY = ""

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + SECRET_KEY
}
url = FIREBASE_URL + "/GreenHouse"


def conectarWifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Conectando no WiFi...")
        wlan.connect(nome, senha)
        while not wlan.isconnected():
            pass
        
    print("Wifi conectado... IP: {}".format(wlan.ifconfig()[0]))

def enviarFire(data, complement = ""):
    response = urequests.put(url+"/"+complement+"/"+".json", data=ujson.dumps(data), headers=headers)
    
    response.close()
    
    
def getData(var):
    response = urequests.get(url+"/"+var+"/"+".json", headers=headers)

    if response.status_code == 200:
        data = ujson.loads(response.text)
    else:
        print("Failed to retrieve data. Status code:", response.status_code)
    
    response.close()
    return data


conectarWifi()


while True:
     
    sensor_ldr = ADC(Pin(34))
    sensor_dht = dht.DHT11(Pin(26))
    
    sensor_ldr.atten(ADC.ATTN_11DB)
    sensor_ldr.width(ADC.WIDTH_12BIT)
    
        
    sensor_dht.measure()
    dht_h = sensor_dht.humidity()
    print(f"umity: {dht_h}")
    
    dht_t = sensor_dht.temperature()
    print(f"temp: {dht_t}")
    
    Sinal_ldr = sensor_ldr.read()
    print(f"Luz: {Sinal_ldr}")
    
    data = {"Umidade": dht_h, "Temperatura": dht_t, "Luz": Sinal_ldr}
    
    print("-----------")
    
    dataA = getData("Acionadores")
    dataM = getData("Modos")
    
    watering = dataA["Irrigacao"]
    venting = dataA["Ventilacao"]
    door = dataM["Comporta"]
    light = dataM["Luz"]
    manual = dataM["Manual"]
    
    if manual == 1:
        if dht_t >= 25:
            enviarFire(1, "Acionadores/Ventilacao")
        
    enviarFire(data, "Sensores")
    time.sleep(1)


