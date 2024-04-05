
var patterns = new Array()
var addingpatterns = true

var xofbase = '0'.charCodeAt(0)
var xofmax = '~'.charCodeAt(0) - xofbase

var xof0 = new Array('')
for (var i = 1; i <= xofmax + 1; i++) {
	xof0.push(xof0[i - 1] + '0')
}

var xsof1 = new Array('')
for (var i = 1; i <= 9; i++) {
	xsof1.push(xsof1[i - 1] + '1')
}
for (var i = 10; i <= xofmax; i++) {
	var n1 = Math.floor((i - 10) / 30 + 1)
	var n0 = (i - 10) % 30 + 1
	xsof1.push(xsof1[n1] + xof0[n0])
}

function fromxsof(xof)
{
	var r = ''
	var ln = ''
	var i = 0
	var a = '*'.charCodeAt(0) - xofbase
	var eof = '.'.charCodeAt(0) - xofbase
	var eol = '-'.charCodeAt(0) - xofbase
	while (i < xof.length) {
		var c = xof.charCodeAt(i++) - xofbase
		if (c >= 0) {
			ln += xof0[c];
		}
		else {
			if (c == a) {
				c = xof.charCodeAt(i++) - xofbase
				while (c-- > 0) {
					ln += xof0[xofmax + 1];
				}
				ln += xof0[xof.charCodeAt(i++) - xofbase]
			}
			else if (c == eol) {
				ln += '0.'
				continue
			}
			else if (c == eof) {
				return r + ln
			}
		}

		for (;;) {
			if (ln.length > 1000) {
				r += ln; ln = ''
			}
			c = xof.charCodeAt(i++) - xofbase
			if (c >= 0) {
				ln += xsof1[c]
				if (c > 9)
					continue
			}
			else {
				if (c == a) {
					c = xof.charCodeAt(i++) - xofbase
					while (c-- > 0) {
						ln += '1111111111';
					}
					ln += xsof1[xof.charCodeAt(i++) - xofbase]
				}
				else if (c == eol) {
					ln += '0.'
					break
				}
				else if (c == eof) {
					return r + ln
				}
			}

			c = xof.charCodeAt(i++) - xofbase
			if (c >= 0) {
				ln += xof0[c];
			}
			else {
				if (c == a) {
					c = xof.charCodeAt(i++) - xofbase
					while (c-- > 0) {
						ln += xof0[xofmax + 1];
					}
					ln += xof0[xof.charCodeAt(i++) - xofbase]
				}
				else if (c == eol) {
					ln += '0.'
					break
				}
				else if (c == eof) {
					return r + ln
				}
			}
		}
	}
	return r + ln
}

function reduce(rule)
{
	var bs = rule.split('/')
	var b = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0)
	for (var i = 0; i < bs[0].length; i++) {
		b[bs[0].charAt(i) - '0'] = 1
	}
	var s = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0)
	for (var i = 0; i < bs[1].length; i++) {
		s[bs[1].charAt(i) - '0'] = 1
	}
	
	var mb = new Array(); var ms = new Array()
	for (var n = 0; n < 5; n++) {
		for (var f = 0; f < 5; f++) {
			mb.push(b[f + n])
			ms.push(s[f + n])
		}
	}
	return 'n' + mb.join('') + 'c' + ms.join('') + 'n8'
}
	
function AppletHtml(writer, zoom, rate, colors, caption, above, below, sizeinfofcn)
{
	var ca = new Ca()
	
	var aw = zoom * (this.univWidth - 2 * this.hideh)
	var ah = zoom * (this.univHeight - 2 * this.hidev)
	
	ca.appletSize = '' + aw + ',' + ah

	var upwidth = this.univWidth + (this.univWidth % 2)
	ca.resetBounds = '' + (this.x + (upwidth % 4 == 2 ? 1 : 0)) + ',' + this.y + ',' + this.width + ',' + this.height
	ca.resetFormation = fromxsof(this.sof)
	ca.resetGeneration = this.resetGeneration
	ca.resetInterval = this.resetTime
	upwidth += upwidth % 4
	ca.universeSize = '' + upwidth + ',' + this.univHeight
	ca.zoom = '' + zoom
	ca.rule = rate == '0' ? '/012345678' : colors ? this.rule : reduce(this.rule)
	ca.maximumRate = rate == null ? null : '' + rate

	if (caption.length == 0) {
		ca.caption = this.name
	}
	else {
		ca.caption = caption[0];
		for (var i = 1; i < caption.length; i++) {
			ca.caption += '<br>' + caption[i]
		}
	}
	ca.caption += '<P>' + (above.length ? (above + '<br>') : '') + (rate == '0' ? '' : 'Click to restart') +
					(below.length == 0 ? '' : '<br>' + below)
	
	if (sizeinfofcn != null) {
		ca.caption += sizeinfofcn(this, aw, ah, zoom)
	}
	
	ca.write(writer)
}

function PCViewerPattern(name, group, captionLines, sof, rule, maxRate, resetGeneration, resetTime, x, y, width, height,
						univWidth, univHeight, hideh, hidev) {
	
	this.AppletHtml = top.AppletHtml
	
	this.name = name
	this.group = group
	this.captionLines = captionLines == null ? new Array() : captionLines
	this.sof = sof
	this.rule = rule == null ? '3/23' : rule
	this.maxRate = maxRate
	this.resetGeneration = resetGeneration
	this.resetTime = resetTime
	this.x = x
	this.y = y
	this.width = width
	this.height = height
	this.univWidth = univWidth
	this.univHeight = univHeight
	this.hideh = hideh
	this.hidev = hidev
	
	if (addingpatterns) {
		top.patterns.push(this)
	}
}

