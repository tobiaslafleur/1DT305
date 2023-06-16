from machine import I2C, Pin, ADC
from time import sleep, time
from ntptime import settime
from stemma_soil_sensor import StemmaSoilSensor
from dht import DHT11
from ujson import dumps
from utilities import WET, DRY, LIGHT, DARK, CLIENT_ID, MQTT_TOPIC, INTERVAL_TIME, calculate_percentage, connect_to_mqtt, check_wlan_connection

soil_sensor = StemmaSoilSensor(I2C(0, scl=Pin(17), sda=Pin(16), freq=400000))
humidity_sensor = DHT11(Pin(15))
photo_resistor = ADC(1)
led = Pin("LED", Pin.OUT)

while True:
    led.on()
    check_wlan_connection()
    client = connect_to_mqtt()

    settime()
    current_time = time()

    humidity_sensor.measure()

    temperature = humidity_sensor.temperature()
    humidity = humidity_sensor.humidity()
    moisture = soil_sensor.get_moisture()
    brightness = photo_resistor.read_u16()

    moisture_percent = calculate_percentage(WET, DRY, moisture)
    brightness_percent = calculate_percentage(LIGHT, DARK, brightness)

    json_data = dumps({"moisture": moisture_percent, "temperature": temperature, "humidity": humidity, "brightness": brightness_percent, "client_id": CLIENT_ID.decode("utf-8"), "date": current_time})

    try: 
        client.publish(MQTT_TOPIC, json_data)
    except Exception as e:
        pass
    finally: 
        client.disconnect()
        led.off()
        sleep(INTERVAL_TIME)
