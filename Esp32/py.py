from machine import Pin, ADC, time_pulse_us
import time
import network
import urequests
import ujson
import dht
import socket

#leds
led1 = Pin(14, Pin.OUT)  
led2 = Pin(32, Pin.OUT)  
led3 = Pin(33, Pin.OUT)
led4 = Pin(25, Pin.OUT)
led5 = Pin(27, Pin.OUT)
rele1 = Pin(12,Pin.OUT)
#ultrasom
TRIG = Pin(18, Pin.OUT)
ECHO = Pin(19, Pin.IN)

def get_distance():
    # Dispara pulso
    TRIG.value(0)
    time.sleep_us(5)
    TRIG.value(1)
    time.sleep_us(10)
    TRIG.value(0)
    print("pulso enviado")
    
    # Mede tempo em microssegundos
    duracao = time_pulse_us(ECHO, 1, 60000)
    print("duração: ", duracao)
    
    if duracao < 0:
        return None  # erro na leitura

    # Calcula distância em cm
    return (duracao * 0.0343) / 2 

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
    
    # led1 = Irrigacao
    # led2 = Ventilacao
    # led3 = Door
    # led4 = Luz
    # led5 = Automatico
    
    if manual == 1: #Automatico
        led5.value(0)
        if dht_t >= 18:
            enviarFire(1, "Acionadores/Ventilacao")
            led2.value(1)
            rele1.value(1)
            
    else:
        led5.value(1)
        irrigacao = getData("Acionadores/Irrigacao")
        ventilacao = getData("Acionadores/Ventilacao")
        luz = getData("Modos/Luz")
        comporta = getData("Modos/Comporta")
        
        print(irrigacao, ventilacao, luz, comporta)
        
        if irrigacao == 1:
            led1.value(1)
        if ventilacao == 1:
            led2.value(1)
            rele1.value(1)
        if luz == 1:
            led3.value(1)
        if comporta == 1:
            led4.value(1)
            
        if irrigacao == 0:
            led1.value(0)
        if ventilacao == 0:
            led2.value(0)
            rele1.value(0)
        if luz == 0:
            led3.value(0)
        if comporta == 0:
            led4.value(0)  
        
            
            
    dist = get_distance()
    if dist:
        print("Distancia: {:.2f} cm".format(dist))
    else:
        print("Erro de leitura")
        
    enviarFire(data, "Sensores")
    time.sleep(1)
    
    
    
