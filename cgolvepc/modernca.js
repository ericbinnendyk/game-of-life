/*
	modernca.js

Updates:
04/08/07 - Slimmed down for CGOLVE use
*/

function Writer_write(string) {
	this.target.write(string)
}

function Writer_writeln(string) {
	this.target.writeln(string)
}

function Writer(targetObject) {
	this.write = Writer_write
	this.writeln = Writer_writeln
	this.target = targetObject
}

function Ca_writeParam(writerObject, paramNameString, paramValueString) {
	if (paramValueString) {
		writerObject.writeln(
			'<param name="' + paramNameString + '" value="' + paramValueString + '">')
	}
}

function Ca_write(writerObject, defaultCa) {

	if (defaultCa == null) {
		defaultCa = this
	}

	var appletWidth = 256
	var appletHeight = 256

	var appletSize = this.appletSize ? this.appletSize : defaultCa.appletSize
	var zoom = this.zoom ? this.zoom : (defaultCa.zoom ? defaultCa.zoom : 2)
	var universeSize = this.universeSize ? this.universeSize
										 : (defaultCa.universeSize ? defaultCa.universeSize : '128,128')
	var dimensions
	if (appletSize == null) {
		dimensions = universeSize.split(',')
		if (dimensions.length > 1) {
			appletWidth = zoom * dimensions[0]
			appletHeight = zoom * dimensions[1]
		}
	} else {
		dimensions = appletSize.split(',')
		if (dimensions.length > 1) {
			appletWidth = dimensions[0]
			appletHeight = dimensions[1]
		}
	}

	if (this.caption) {
		writerObject.writeln('<TABLE><TR ALIGN="CENTER"><TD ALIGN="CENTER">')
	}

	writerObject.writeln(
		'<APPLET ' +
			(this.name ? this.name : ' ') +
			' CODEBASE = "." ARCHIVE = "modernca.jar" CODE = "modernca.Ca.class" ' +
			'WIDTH = "' + appletWidth + '" HEIGHT = "' + appletHeight + '" ALIGN = "middle">')
		
	
	Ca_writeParam(writerObject, "Maximum Rate", this.maximumRate ? this.maximumRate : defaultCa.maximumRate)
	Ca_writeParam(writerObject, "Reset Bounds", this.resetBounds ? this.resetBounds : defaultCa.resetBounds)
	Ca_writeParam(writerObject, "Reset Formation", this.resetFormation ? this.resetFormation : defaultCa.resetFormation)
	Ca_writeParam(writerObject, "Reset Generation", this.resetGeneration ? this.resetGeneration : defaultCa.resetGeneration)
	Ca_writeParam(writerObject, "Reset Interval", this.resetInterval ? this.resetInterval : defaultCa.resetInterval)
	Ca_writeParam(writerObject, "Rule", this.rule ? this.rule : defaultCa.rule)
	Ca_writeParam(writerObject, "Rule Mutation Rate", this.ruleMutationRate ? this.ruleMutationRate : defaultCa.ruleMutationRate)
	Ca_writeParam(writerObject, "Universe Size", this.universeSize ? this.universeSize : defaultCa.universeSize)
	Ca_writeParam(writerObject, "Zoom", zoom != 2 ? zoom : null)

	writerObject.writeln('</APPLET>')

	if (this.caption) {
		writerObject.writeln(
			'</TD></TR><TR ALIGN="CENTER"><TD ALIGN="CENTER">' + this.caption +
			'</TD></TR></TABLE>')
	}
}

function Ca() {
	this.write = Ca_write

	this.name = null
	this.appletSize = null

	this.maximumRate = null
	this.resetBounds = null
	this.resetFormation = null
	this.resetGeneration = null
	this.resetInterval = null
	this.rule = null
	this.ruleMutationRate = null
	this.universeSize = null
	this.caption = null
	this.zoom = null
}

function writeSelect(writer, name, onChangeFcnString, itemsArray, selection)
{
	writer.write('<SELECT NAME="' + name + '" OnChange="' + onChangeFcnString + '(this.selectedIndex)">')
	for (var i = 0; i < itemsArray.length; i++) {
		writer.write('<option' + (i == selection ? ' selected>' : '>') + itemsArray[i])
	}
	writer.write('</SELECT>')
}

function writeSelectRow(writer, label, onChangeFcnString, itemsArray, selection)
{
	writer.write('<TR><TD>' + label + ':</TD><TD>')
	writeSelect(writer, label, onChangeFcnString, itemsArray, selection)
	writer.writeln('</TD></TR>')
}
