from network import STA_IF, WLAN
from ubinascii import hexlify
from machine import unique_id, reset
from mqtt import MQTTClient
from time import sleep

WLAN_SSID = # Wifi ssid
WLAN_PASSWORD = # Wifi password
MQTT_HOST = # MQTT Broker IP
MQTT_TOPIC = # MQTT topic to publish to
WET = # Highest value when moisture meter is in wet soil
DRY = # Lowest value when moisture meter is in dry soil
LIGHT = # Highest value when photo resistor is in a light environment
DARK = # Lowest value when photo resistor is in a dark environment
INTERVAL_TIME = # Time in seconds between each reading of the sensors
CLIENT_ID = hexlify(unique_id())

def connect_to_wlan():
    wlan = WLAN(STA_IF)

    if not wlan.active():
        wlan.active(True)
    
    i = 1

    if not wlan.isconnected(): 
        for _ in range(10):
            wlan.connect(WLAN_SSID, WLAN_PASSWORD)
            sleep(5)
            i += 1

            if wlan.isconnected():
                break

            sleep(30)

        

def check_wlan_connection(): 
    wlan = WLAN(STA_IF)

    if not wlan.isconnected():
        return connect_to_wlan()

    return wlan

def connect_to_mqtt():
    client = MQTTClient(CLIENT_ID, MQTT_HOST)

    count = 0

    while True:
        try: 
            count += 1
            client.connect()
            return client
        except Exception as e:
            if count >= 5: 
                reset()

def calculate_percentage(high, low, value): 
    return round(((value - low) * 100) / (high - low), 2)
