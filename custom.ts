/**
 * Grove SHT31 - extension MakeCode
 */
//% weight=100 color=#1E90FF icon="\uf2c9" block="SHT31"
namespace sht31 {

    const SHT31_ADDR = 0x44
    const SHT31_MEAS_HIGHREP = 0x2400

    function writeCommand(cmd: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = (cmd >> 8) & 0xFF
        buf[1] = cmd & 0xFF
        pins.i2cWriteBuffer(SHT31_ADDR, buf)
    }

    function crc8(data1: number, data2: number): number {
        let crc = 0xFF
        let polynomial = 0x31

        crc ^= data1
        for (let i = 0; i < 8; i++) {
            if (crc & 0x80) {
                crc = ((crc << 1) ^ polynomial) & 0xFF
            } else {
                crc = (crc << 1) & 0xFF
            }
        }

        crc ^= data2
        for (let i = 0; i < 8; i++) {
            if (crc & 0x80) {
                crc = ((crc << 1) ^ polynomial) & 0xFF
            } else {
                crc = (crc << 1) & 0xFF
            }
        }

        return crc
    }

    function readRawData(): Buffer {
        writeCommand(SHT31_MEAS_HIGHREP)
        basic.pause(50)
        return pins.i2cReadBuffer(SHT31_ADDR, 6)
    }

    /**
     * Retourne la température en °C
     */
    //% block="température SHT31 (°C)"
    //% weight=90
    export function temperatureC(): number {
        let data = readRawData()
        if (data.length != 6) return -999

        if (data[2] != crc8(data[0], data[1])) return -999

        let rawTemp = (data[0] << 8) | data[1]
        let temp = -45 + (175 * rawTemp / 65535)

        return Math.round(temp * 100) / 100
    }

    /**
     * Retourne l'humidité en %
     */
    //% block="humidité SHT31 (\\%)"
    //% weight=80
    export function humidity(): number {
        let data = readRawData()
        if (data.length != 6) return -999

        if (data[5] != crc8(data[3], data[4])) return -999

        let rawHum = (data[3] << 8) | data[4]
        let hum = 100 * rawHum / 65535

        return Math.round(hum * 100) / 100
    }
}