input.onButtonPressed(Button.A, function () {
    basic.showNumber(sht31.temperatureC())
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(sht31.humidity())
})
basic.forever(function () {
	
})
