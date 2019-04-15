var fs = require('fs'),
    xml2js = require('xml2js');
	
var hours = [];

module.exports.parseUP = function (file, done) {

var parser = new xml2js.Parser();
data = file.toString();
	
	var res = []
    parser.parseString(data, (err, result) => {
        var year = result['Документ']['План'][0]['Титул'][0]['$']['ГодНачалаПодготовки']
		var courses = result['Документ']['План'][0]['Титул'][0]['ГрафикУчПроцесса'][0]['Курс']
		for (var i=1; i<courses.length; i++) {
			for (var j=0; j<2; j++) {
				if (courses[i]['Семестр'][j]['$']['СтрНедТО']!=undefined)
					hours.push({'sem':parseInt((courses[i]['$']['Ном']-1)*2)+parseInt(courses[i]['Семестр'][j]['$']['Ном']), 'hours':courses[i]['Семестр'][j]['$']['СтрНедТО'] });		
			}
		}
		var dis = result['Документ']['План'][0]['СтрокиПлана'][0]['Строка']
		for (var i = 0; i < dis.length; i++) {	
			var choise;
			if (dis[i]['$']['НовИдДисциплины'] != undefined && (dis[i]['$']['НовИдДисциплины']).indexOf('В.ДВ')>=0) 
				choise = 1;
			else if (dis[i]['$']['НовИдДисциплины'] != undefined && (dis[i]['$']['НовИдДисциплины']).indexOf('ФТД')>=0)
				choise = 2;
			else choise = 0;
			var discip = dis[i]['$']['Дис'];
			for (j=0; j<dis[i]['Сем'].length; j++) {
				var sem = dis[i]['Сем'][j]['$']['Ном'];
				var lab = dis[i]['Сем'][j]['$']['Лаб']!=undefined ?  norm(parseFloat((parseInt(dis[i]['Сем'][j]['$']['Лаб'])/2)/hours[dis[i]['Сем'][j]['$']['Ном']-1].hours).toFixed(1)) : 0;
				var pr = dis[i]['Сем'][j]['$']['Пр']!=undefined ?  norm((parseInt(dis[i]['Сем'][j]['$']['Пр'])/2/hours[dis[i]['Сем'][j]['$']['Ном']-1].hours).toFixed(1)) : 0;
				var lek = dis[i]['Сем'][j]['$']['Лек']!=undefined ?  norm((parseInt(dis[i]['Сем'][j]['$']['Лек'])/2/hours[dis[i]['Сем'][j]['$']['Ном']-1].hours).toFixed(1)) : 0;
				var otc = dis[i]['Сем'][j]['$']['Экз']!=undefined ? "Экз" : dis[i]['Сем'][j]['$']['ЗачО']!=undefined ? "ЗачО" : "Зач"
				if (!(pr==0 && lek==0 && lab==0))
				res.push({'year':year, 'dis':discip, 'choise':choise, 'sem':sem, 'lek':lek, 'pr':pr, 'lab':lab, 'control': otc })
			}
		}
		});
		done(res)
	

}

var norm = function(c) {
	if (c==0.5 || c==1.5) return c;
	else return Math.round(c)
}

module.exports.beforeParse = function (file, done) {
data = file.toString();
var parser = new xml2js.Parser();
var res = []
	parser.parseString(data, (err, result) => {
        var year = result['Документ']['План'][0]['Титул'][0]['$']['ГодНачалаПодготовки']
        var spec = result['Документ']['План'][0]['Титул'][0]['Специальности'][0]['Специальность'][0]['$']['Название']
		res.push({'year':year, 'spec': spec});
		done(res)
	});

}