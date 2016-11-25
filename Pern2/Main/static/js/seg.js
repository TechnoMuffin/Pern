////////////////////////////////////////////
//Asignación de funciones a elementos HTML//
////////////////////////////////////////////
/*Aqui se conecta Javascript con FRONTEND, betch!
Y usamos variables universalessss, mas info aqueeh: http://librosweb.es/libro/javascript/capitulo_4/ambito_de_las_variables.html*/

var cbxCourse = $("#cbxCourse");
var cbxModule = $("#cbxModule");
var cbxProject = $("#cbxProject");
var cbxActivity = $("#cbxActivity");
var cbxStudent = $("#cbxStudent");

var cbxProjectFW = $("#cbxProjectFW");

var personalFollowHTML = $("#personalFollow")

var currentStudentSelected; //Necesitaremos guardar en esta variable el alumno seleccionado para algunas funciones


var tableStudents = $('#myTable'); //Table PupilFollowing
var tbStudent = $("#tbAlumnos"); //Body table PupilFollowing
var tbProjectStudent = $("#tbProjectStudent");
var tableHistory = $('#historyTable'); //Table History
var tbHistory = $('#tbHistory'); //Body Table History

tableHistory.css('max-height', $( window ).height());

var tbFF = $('#tbFulfillments'); //Tabla de cumplimientos

var date = $('#datepicker');
var nameStudentHTML = $('.nameStudent')

//Activity fields
var actName=$('#actName');
var actCode=$('#actCode');
var actStatus=$('#actStatus');
var actClasses=$('#actClasses');
var actCalification=$('#actCalification');

var currentActivity = '';

cbxProjectFW.on('change', function(){projectWorkingChanged()});
cbxCourse.on('change', function(){courseChanged()});
cbxModule.on('change', function(){moduleChanged()});
cbxProject.on('change', function(){projectChanged()});
cbxActivity.on('change', function(){activityChanged()});
cbxStudent.on('change', function(){studentChanged()});
tableStudents.on('click', '.clickable-row', function(event) {$(this).addClass('active').siblings().removeClass('active');});
tbProjectStudent.on('click', '.clickable-row', function(event) {$(this).addClass('active').siblings().removeClass('active');});

/////////////////////////////////
//Funciones para limpiar campos//
/////////////////////////////////

// Vaciar la tabla de alumnos
function resetStudentWorkingTable(){
    tbProjectStudent.empty();
}
function resetStudentTable(){
    tbStudent.empty();
    // console.log('xd');
    tbProjectStudent.empty();
}

function resetHistoryTable(){
    tbHistory.empty();
}

//Vaciar la tabla de cumplimientos
function resetFFTable(){
    tbFF.empty();
}

//Resetear ComboBox de Módulos a valores iniciales
function resetModuleField(){
    cbxModule.empty();
    cbxModule.append(new Option('Módulo', ''));
    cbxModule.selectpicker('refresh');
}

function resetProjectField(){
    cbxProject.empty();
    cbxProject.append(new Option('Proyectos', ''));
    cbxProject.selectpicker('refresh');
}
function resetProjectFWField(){
    cbxProjectFW.empty();
    cbxProjectFW.append(new Option('Proyectos', ''));
    cbxProjectFW.selectpicker('refresh');
}

function resetStudentField(){
    cbxStudent.empty();
    cbxStudent.append(new Option('Alumno', ''));
    cbxStudent.selectpicker('refresh');
    resetHistoryTable();
}

function resetActivityField(){
    cbxActivity.empty();
    cbxActivity.append(new Option('Actividad', ''));
    cbxActivity.selectpicker('refresh');
    resetActivityData();
}
function resetActivityData(){
    actName.text('---');
    actCode.text('---');
    actStatus.text('---');
    actClasses.text('---');
    actCalification.text('---');
}

function resetPersonalFollow(){
    resetProjectField();
    resetActivityField();
    personalFollowHTML.addClass('disabledDIV');
}

///////////////////////
//Funciones para AJAX//
///////////////////////

//Esta funcion hace algo
  function courseChanged(){
    // $('#buttonCreateProject').addClass('disabledDIV');
    // $('#promActivity').addClass('disabledDIV');
    // $('#finishWork').addClass('disabledDIV');
    // $('#buttonDeleteProject').addClass('disabledDIV');
    // $('#buttonEditProject').addClass('disabledDIV');
    // $('#addActivity').addClass('disabledDIV');
    cleanTableActivities();
    resetModuleField();
    // resetProjectFWField();
    resetStudentTable();
    resetPersonalFollow();
    resetHistoryTable();
    resetStudentField();
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "subjects"},
            dataType: 'json',
            success: function(info){
                resetModuleField();
                for(var i=0;i<info.length;i++){
                    //El valor de las opciones de los select es el ID de los modulos
                    var text = info[i].fields.nameModule;
                    var value = info[i].pk;
                    cbxModule.append(new Option(text, value));
                }
                cbxModule.selectpicker('refresh');
            }
        });
    }
}


function projectWFChanged(){
    cleanTableActivities();
    resetStudentTable();
    resetProjectField();
    resetPersonalFollow();
    resetHistoryTable();
    if(this.val!=''){
        //Carga de Alumnos
        $.ajax({
            url: url,
            type: 'GET',
            data: {idCourse: cbxCourse.val(), queryId: "students"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var texto = info[i].fields.name + " " + info[i].fields.surname;
                    var value = info[i].pk;
                    var elemento = '<tr class="clickable-row" onclick="selectStudent(event,'+value+')"><td><input type="checkbox"></td><td>'+texto+'</td><td style="text-align:center;"><select><option value="">---</option></select></td></tr>';
                    // var elemento2 = '<tr class="clickable-row" onclick="selectStudentWorking(event,'+value+')"><td>'+texto+'</td><td>PRONTO</td></tr>';
                    tbStudent.append(elemento);
                    // tbProjectStudent.append(elemento2);
                    try{
                        cbxStudent.append(new Option(texto,value));
                    }catch(err){console.log(err)}
                }
                try{
                    cbxStudent.selectpicker('refresh');
                }catch(e){console.log(err)}
            }
        });
        $.ajax({
            url: url,
            type: 'GET',
            data: {idProject: cbxProjectFW.val(), queryId: "fulfillments"},
            dataType: 'json',
            success: function(info){
                resetFFTable();
                for(var x=0;x<info.length;x++){
                    nameFF = info[x]['fields']['nameFF'];
                    idFF = info[x]['pk'];
                    var elemento = '<tr><td><input type="checkbox"></td><td value =' + idFF +'>' + nameFF +'</td><td>%</td></tr>';
                    tbFF.append(elemento);
                }
            }
        });

    }
    else{
    $('#cbxProjectFW').val('');
    resetStudentTable();
    }
  $('#titleEditNameProject').text('Modificar ' + $('#cbxProjectFW option:selected').text());
}

//Cambia CBX MODULO
function moduleChanged(){
    // $('#buttonCreateProject').addClass('disabledDIV');
    // $('#promActivity').addClass('disabledDIV');
    // $('#finishWork').addClass('disabledDIV');
    // $('#addActivity').addClass('disabledDIV');
    // $('#buttonDeleteProject').addClass('disabledDIV');
    // $('#buttonEditProject').addClass('disabledDIV');
    cleanTableActivities();
    resetStudentField();
    resetStudentTable();
    resetProjectField();
    resetProjectFWField();
    resetPersonalFollow();
    //Carga de Alumnos
    $.ajax({
        url: url,
        type: 'GET',
        data: {idCourse: cbxCourse.val(), queryId: "students"},
        dataType: 'json',
        success: function(info){
            for(var i=0;i<info.length;i++){
                var texto = info[i].fields.name + " " + info[i].fields.surname;
                var value = info[i].pk;
                try{
                    cbxStudent.append(new Option(texto,value));
                }catch(err){console.log(err)}
            }
            try{
                cbxStudent.selectpicker('refresh');
            }catch(e){console.log(err)}
        }
    });

    //Carga de Projectos
    $.ajax({
        url: url,
        type: 'GET',
        data: {module: cbxModule.val(), queryId: "projects"},
        dataType: 'json',
        success: function(info){
            for(var i=0;i<info.length;i++){
                //El valor de las opciones de los select es el ID de los proyectos
                var nameProject = info[i].fields.nameProject;
                var value = info[i].pk;
                cbxProject.append(new Option(nameProject, value));
                cbxProjectFW.append(new Option(nameProject, value));
            }
            cbxProject.selectpicker('refresh');
            cbxProjectFW.selectpicker('refresh');
        }
    });
    if (cbxModule.val()!=""){
      $('#buttonCreateProject').removeClass('disabledDIV');
    }


}


function projectChanged(){
    resetActivityField();
    $.ajax({
        url: url,
        type: 'GET',
        data: {idCourse: cbxCourse.val(),
               idProject: cbxProject.val(),
               queryId: "activities"},
        dataType: 'json',
        success: function(info){
            for(var i=0;i<info.length;i++){
                //El valor de las opciones de los select es el ID de las Activities
                var nameActivity = info[i].fields.nameActivity;
                var value = info[i].pk;
                cbxActivity.append(new Option(nameActivity, value));
            }
            cbxActivity.selectpicker('refresh');
        }
    });
}


function studentChanged(){
    //Cuando el select cbxStudent cambia de valor carga los datos correspondientes del alumno
    resetHistoryTable();
    console.log(cbxStudent.val());
    if(this.val!=''){
        $.ajax({
            url: url,
            type: 'GET',
            data: {idStudent: cbxStudent.val(), queryId: "history"},
            dataType: 'json',
            success: function(info){
                for(var i=0;i<info.length;i++){
                    var idSF=info[i].pk;
                    for(var v=0;v<info.length;v++){
                        if(info[v].model=='database.onclass'){
                            if(info[v].fields.idSF==idSF){
                                var activity = info[v].fields.idActivity[1];
                                var project = info[v].fields.idActivity[2];
                                v=info.length;
                            }
                        }
                    }
                    var presencia = info[i].fields.presenceSF;
                    var fecha = info[i].fields.dateSF;
                    var obs = info[i].fields.commentPF;
                    sinObs='<td><button type="button" class="btn btn-warning pull-right disabledDIV">'+
                        '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>'+
                        '</button></td>';
                    if(info[i].model=="database.studentfollowing"){
                        if(presencia){
                            presencia='<span class="glyphicon glyphicon-ok verde" aria-hidden="true"></span>';
                            var elemento = '<tr class="clickable-row">'+
                                '<th scope="row">'+presencia+'</th>'+
                                '<td>'+fecha+'</td>'+
                                '<td>'+activity+' de '+project+'</td>';
                            if(obs!=''){
                                elemento=elemento+'<td>'+createModalObs('modal'+idSF,obs)+'</td></tr>';
                            }else{
                                elemento=elemento+sinObs;
                            }
                        }else{
                            presencia='<span class="glyphicon glyphicon-remove rojo" aria-hidden="true"></span>';
                            var elemento = '<tr class="clickable-row">'+
                                '<th scope="row">'+presencia+'</th>'+
                                '<td>'+fecha+'</td>'+
                                '<td>Alumno Ausente</td>';
                            elemento=elemento+sinObs;
                        }
                        tbHistory.append(elemento);
                    }
                }
            }
        });
    }
}

//ACA PASA LA MAGIA DE LA SELECCION DE ESTUDIANTE
function selectStudent(evt,valor) {
    console.log(valor);
    currentStudentSelected=valor;
    $.ajax({
        url: url,
        type: 'GET',
        data: {idStudent: currentStudentSelected,
               queryId: "onlyStudent"},
        dataType: 'json',
        success: function(info){
            nameStudentHTML.text(info[0].fields.name+' '+info[0].fields.surname);
        }
    });
    personalFollowHTML.removeClass('disabledDIV');
    activityChanged();
}

//////////////////////////////
//Funcion de Modal Bootstrap//
//////////////////////////////
function createModalObs(idCoso,content){
    var someHTML = '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#'+idCoso+'">'+
        '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></button>'+
        '<div id="'+idCoso+'" class="modal fade" role="dialog">'+
        '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '<h4 class="modal-title">Observaciones</h4></div><div class="modal-body">'+
        '<p style="white-space: pre-wrap">'+content+'</p></div><div class="modal-footer">'+
        '<button type="button" class="btn btn-default" data-dismiss="modal">Ok</button>'+
        '</div></div></div></div>';
    return someHTML;
}

function activityChanged(){
    resetActivityData();
    $.ajax({
        url: url,
        type: 'GET',
        data: {idActivity: cbxActivity.val(),
               idStudent: currentStudentSelected,
               queryId: "working"},
        dataType: 'json',
        success: function(info){
            i=info[0].fields;
            i2=info[1].fields;
            actName.text(i2.nameActivity);
            actCode.text(info[1].pk);
            if(i.hasFinish){
                actStatus.css('color','green');
                actStatus.text('Terminado');
            }else{
                actStatus.css('color','yellow');
                actStatus.text('Pendiente');
            }
            actClasses.text(i.numberOfClasses);
            actCalification.text(i.calification);
        }
    });
}

//ACA PASA LA MAGIA DE LA SELECCION DE ESTUDIANTE
function selectStudent(evt,valor) {
    currentStudentSelected=valor;
    $.ajax({
        url: url,
        type: 'GET',
        data: {idStudent: currentStudentSelected,
               queryId: "onlyStudent"},
        dataType: 'json',
        success: function(info){
            nameStudentHTML.text(info[0].fields.name+' '+info[0].fields.surname);
        }
    });
    personalFollowHTML.removeClass('disabledDIV');
    cbxActivity[0].selectedIndex = 0;
    resetActivityData();
}
//Proyecto.html
// $("#activitySender").click(
//     function(){
//         if($('#nameActivity').val()!=""){
//             $.ajax({
//                 url: url2,
//                 type: 'GET',
//                 data: {nameActivity: $('#nameActivity').val(),idProject: $('#cbxProjectFW').val(), queryId: "newActivity"},
//                 success: function(){
//                     tableCreation();
//                     $('#nameActivity').val("");
//                 }
//             });
//         }
//     }
// );
//
// $("#projectSender").click(
//     function(){
//         if($('#projectName').val()!=""){
//             $.ajax({
//                 url: url2,
//                 type: 'GET',
//                 data: {nameProject: $('#projectName').val(),idModule: $('#cbxModule').val(), queryId: "newProject"},
//                 success: function(){
//                     moduleChanged();
//                     $('#cbxProject').val($('#projectName').val());
//                     $('#projectName').val("");
//                 }
//             });
//         }else{
//             alert("Debe completar el campo.");
//         }
//     });
// $("#projectDeleter").click(
//     function(){
//         if($('#cbxProjectFW').val()!=""){
//             $.ajax({
//                 url: url2,
//                 type: 'GET',
//                 data: {idProject: $('#cbxProjectFW').val(), queryId: "delProject"},
//                 success: function(info){
//                     moduleChanged();
//                     $('#delProjectModalSuccess').modal('show');
//                     $('#delProjectResult').text(info);
//                 }
//             });
//         }
//     });
// $("#projectModificator").click(
//     function(){
//       if($('#cbxProjectFW').val()!=""){
//         $.ajax({
//             url: url2,
//             type: 'GET',
//             data: {idProject: $('#cbxProjectFW').val(), nameProject: $('#editProjectName').val(), queryId: "modProject"},
//         });
//       }
//       moduleChanged();
//       $('#cbxProject').val($('#projectName').val());
//       $('#editProjectName').val("");
// });
// function selectStudentWorking(evt,valor) {
//     currentStudentSelected=valor;
//     tableCreation();
//     console.log(currentStudentSelected);
//
// }
//
// function tableCreation(){
//   $.ajax({
//       url: url2,
//       type: 'GET',
//       data: {idStudent: currentStudentSelected, idProject: cbxProjectFW.val(),queryId: "getActivities"},
//       dataType: 'json',
//       success: function(info){
//           cleanTableActivities();
//           for(var i=0;i<info.length;i++){
//               var textName = info[i].fields.idActivity[1];
//               var textNOC = info[i].fields.numberOfClasses;
//               var textCal = info[i].fields.calification;
//               var value = info[i].pk;
//               var table = '<tr><td>'+textName+'</td>'+
//                               '<td>'+textNOC+'</td>'+
//                               '<td class="tdNota">'+textCal+'</td>'+
//                               '<td><button data-toggle="modal" onclick="setCurrentActivity('+value+')" data-target="#modalCalificateWork" class="btn btn-default "><span class="glyphicon glyphicon-star"></span></button></td>'+
//                               '<td><button data-toggle="modal" onclick="setCurrentActivity('+value+')" data-target="#modalEditWork" class="btn btn-default "><span class="glyphicon glyphicon-edit"></span></button></td>'+
//                               '<td><button data-toggle="modal" onclick="setCurrentActivity('+value+')" data-target="#modalDeleteWork" class="btn btn-default botonDel"><span class="glyphicon glyphicon-trash"></span></button></td></tr>';
//               $('#tableActivities').append(table);
//               $('#promActivity').removeClass('disabledDIV');
//               $('#finishWork').removeClass('disabledDIV');
//
//           }
//
//       }
//   });
// }
function cleanTableActivities(){
    $('#tableActivities').empty();
}
// function setCurrentActivity(valor){
//     currentActivity=valor;
//     console.log(currentActivity);
// }
// function activityDeleter(){
//   $.ajax({
//       url: url2,
//       type: 'GET',
//       data: {currentActivity: currentActivity,queryId: "delActivities"},
//       success: function(){
//           tableCreation();
//           console.log("Puto el que lee(oveja xd)");
//       }
//   });
// }
// function activityModify(){
//   console.log("xddddddddddd");
//   $.ajax({
//       url: url2,
//       type: 'GET',
//       data: {newNameWork: $('#inputEditWork').val(),newCantDays: $('#inputClassesWork').val(),currentActivity: currentActivity,queryId: "modActivities"},
//       success: function(){
//           tableCreation();
//           $('#inputEditWork').val("");
//           $('#inputClassesWork').val("");
//           console.log("Puto el que lee(oveja xp)");
//       }
//   });
// }
// function calActivities(){
//   $.ajax({
//       url: url2,
//       type: 'GET',
//       data: {newCal: $('#inputCal').val(),currentActivity: currentActivity,queryId: "calActivities"},
//       success: function(){
//           tableCreation();
//           $('#inputCal').val("");
//           console.log("Puto el que lee(oveja xp)");
//       }
//   });
// }
function projectWorkingChanged(){
    // $('#promActivity').addClass('disabledDIV');
    // $('#finishWork').addClass('disabledDIV');
    cleanTableActivities();
    resetStudentTable();
    resetProjectField();
    resetPersonalFollow();
    resetHistoryTable();
    // StudentTableCreation();
    // $('#buttonDeleteProject').removeClass('disabledDIV');
    // $('#buttonEditProject').removeClass('disabledDIV');
    // $('#addActivity').removeClass('disabledDIV');


}
//
// function StudentTableCreation (){
//   if(this.val!=''){
//       //Carga de Alumnos
//       $.ajax({
//           url: url2,
//           type: 'GET',
//           data: {idModule: cbxModule.val(),idProject: cbxProjectFW.val(), queryId: "studentsWorking"},
//           dataType: 'json',
//           success: function(info){
//               for(var i=0;i<info.length;i++){
//                   console.log("211");
//                   var texto = info[i].fields.idStudent[1] + " " + info[i].fields.idStudent[2];
//                   var value = info[i].fields.idStudent[0];
//                   var hasFinish = info[i].fields.hasFinish;
//                   if (hasFinish == true){
//                       terminado = "termino"
//                   }
//                   else{
//                       terminado = "no termino"
//                   }
//                   var elemento = '<tr class="clickable-row" onclick="selectStudentWorking(event,'+value+')"><td>'+texto+'</td><td>'+terminado+'</td></tr>';
//                   tbProjectStudent.append(elemento);
//               }
//           }
//       });
//   }
//
// }
//
// function projectFinisher (){
//   console.log("cacaaa");
//
//   if(this.val!=''){
//       //Carga de Alumnos
//       $.ajax({
//           url: url2,
//           type: 'GET',
//           data: {idStudent: currentStudentSelected,idProject: cbxProjectFW.val(), queryId: "finishWorking"},
//           success: function(){
//             console.log("hola");
//             resetStudentWorkingTable();
//             StudentTableCreation();
//           }
//       });
//   }
// }
// function projectNotFinisher (){
//   console.log("mierdaaa");
//
//   if(this.val!=''){
//       //Carga de Alumnos
//       $.ajax({
//           url: url2,
//           type: 'GET',
//           data: {idStudent: currentStudentSelected,idProject: cbxProjectFW.val(), queryId: "notFinishWorking"},
//           success: function(){
//             console.log("chau");
//             resetStudentWorkingTable();
//             StudentTableCreation();
//           }
//       });
//   }
// }
// $("#promActivity").click(
//   function promedioNotas(){
//       $("#spanStar").empty();
//       var avg = 0;
//       var amount = 0;
//       $(".tdNota").each(
//           function(){
//               avg += +($(this).text());
//               amount++;
//           }
//       );
//       avg /= amount;
//       avgNotFloat = Math.trunc(avg);
//       for(var i=0;i<avgNotFloat;i++){
//           $("#spanStar").append('<i class="fa fa-star fa-5x"></i>');
//       }
//       var avgOnlyFloat = avg - avgNotFloat;
//       if (avgOnlyFloat >= 0.1 && avgOnlyFloat <= 0.9){
//           $("#spanStar").append('<i class="fa fa-star-half-o fa-5x"></i>');
//       }
//       var emptyStar = 5 - avg;
//       emptyStar = Math.trunc(emptyStar);
//       for (var i=0;i<emptyStar;i++){
//           $("#spanStar").append('<i class="fa fa-star-o fa-5x"></i>');
//       }
//       var avgFinal = parseFloat(avg);
//       avgFinal = avgFinal.toFixed(2);
//       $("#showProm").text(avgFinal);
//   }
// );
