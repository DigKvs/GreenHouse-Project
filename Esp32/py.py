from machine import Pin, ADC, time_pulse_us, PWM
import time
import network
import urequests
import ujson
import dht
import socket

    # led1 = Irrigacao
    # led2 = Ventilacao
    # led3 = Door
    # led4 = Luz
    # led5 = Automatico
    
#leds
    
    
led1 = Pin(14, Pin.OUT)
rele2 = Pin(32, Pin.OUT)
rele3 = Pin(33, Pin.OUT)
dht_solo = ADC(Pin(4))

rele1 = Pin(12,Pin.OUT)
#ultrasom
TRIG = Pin(18, Pin.OUT)
ECHO = Pin(19, Pin.IN)
#buzzer
buzzer_pin = Pin(13, Pin.OUT)
buzzer = PWM(buzzer_pin)

frequencia = 412

notas = [
    523,  
    0,    
    440,  
    0,    
    392,  
    0,    
    330,  
    0,    
    262,  
    0     
]
    

duracoes = [
    0.15, 0.1,  
    0.15, 0.1,  
    0.15, 0.1,  
    0.15, 0.1,  
    0.2, 0.5   
]


def tocar_nota(frequencia, duracao):
    if frequencia > 0:
        buzzer.freq(frequencia)
        buzzer.duty(412)  
    else:
        buzzer.duty(0)  
    time.sleep(duracao) 
    buzzer.duty(0)

def get_distance():
    # Dispara pulso
    TRIG.value(0)
    time.sleep_us(1)
    TRIG.value(1)
    time.sleep_us(1)
    TRIG.value(0)
    print("pulso enviado")
    
    # Mede tempo em microssegundos
    duracao = time_pulse_us(ECHO, 1, 60000)
    print("duração: ", duracao)
    
    if duracao < 0:
        0
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
    buzzer.duty(0)
    sensor_ldr = ADC(Pin(34))
    sensor_dht = dht.DHT11(Pin(25))
    sensor_dht_ext = dht.DHT11(Pin(26))

     
    sensor_ldr.atten(ADC.ATTN_11DB)
    sensor_ldr.width(ADC.WIDTH_12BIT)
    
        
    #sensor_dht.measure()
    sensor_dht_ext.measure()
    
    dht_h = sensor_dht.humidity() 
    print(f"umity: {dht_h}")
    
    dht_t = sensor_dht.temperature()
    print(f"temp: {dht_t}")
    
    dht_h_ext = sensor_dht_ext.humidity() 
    print(f"umity_ext: {dht_h_ext}")
    
    dht_t_ext = sensor_dht_ext.temperature()
    print(f"temp_ext: {dht_t_ext}")
    
    Sinal_ldr = sensor_ldr.read()
    print(f"Luz: {Sinal_ldr}")
    
    dist = get_distance()
    if dist:
        print("Distancia: {:.2f} cm".format(dist))
    else:
        print("Erro de leitura")
    
    data = {"Umidade": dht_h, "Temperatura": dht_t, "Luz": Sinal_ldr, "Temperatura_Ext": dht_t_ext, "Umidade_Ext": dht_h_ext, "Distancia": dist}
    
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
    # led5 = Automatico
    
    if manual == 1: #Automatico
        led5.value(0)
        if dht_t >= 21:
            enviarFire(1, "Acionadores/Ventilacao")
            rele2.value(1)
            rele1.value(1)
            buzzer.duty(0)
            
    else:
        led5.value(1)
        irrigacao = getData("Acionadores/Irrigacao")
        ventilacao = getData("Acionadores/Ventilacao")
        light = getData("Modos/Luz")
        comporta = getData("Modos/Comporta")
                
        if irrigacao == 1:
            
            led1.value(1)
            rele1.value(1)
            time.sleep_ms(500)
            rele1.value(0)
            for i in range(len(notas)):
                tocar_nota(notas[i], duracoes[i])
                time.sleep(0.05)
            time.sleep(1)
            
        if ventilacao == 1:
            rele2.value(1)            
            
        if light == 1:
            rele3.value(1)

        # if comporta == 1:
            
        if irrigacao == 0:
            led1.value(0)
            buzzer.duty(0)
            rele1.value(0)
            
        if ventilacao == 0:
            rele2.value(0)
            rele1.value(0)

        if light == 0:
            rele3.value(0)
            
        # if comporta == 0:
        
        
    enviarFire(data, "Sensores")
    time.sleep(1)
    





