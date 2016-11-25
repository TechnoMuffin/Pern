//variables globales
var cbxCourse = $("#cbxCourse");
var cbxModule = $("#cbxModule");
var cbxStudent = $("#cbxStudent");
var cbxProjectFW = $("#cbxProjectFW");
var tbProjectStudent = $("#tbProjectStudent");
var tbFulfillments = $("#tbFulfillments");
var createFF = $("#createFF");
var btnCreateProject = $("#buttonCreateProject");
var FFname = $("#FFname");
var currentStudentSelected;


//funciones onchange
cbxCourse.on('change', function() {
    courseChanged()
});
cbxModule.on('change', function() {
    moduleChanged()
});
cbxProjectFW.on('change', function() {
    projectWorkingChanged()
});
btnCreateProject.on('click', function() {
    loadFulFillments()
});
createFF.on('click', function() {
    createFulfillment()
});
tbProjectStudent.on('click', '.clickable-row', function(event) {
    $(this).addClass('active').siblings().removeClass('active');
});

function createFulfillment() {
    if (FFname.val() != '') {
        var nombre = FFname.val();
        var input = '<input type="checkbox" class="FFInput" data-id-FF="crear" data-name-FF="' + nombre + '" checked>';
        tbFulfillments.append('<tr><th>' + input + '</th><th>' + nombre + '</th></tr>');
        FFname.val('');
    }
}

function loadFulFillments() {
    $.ajax({
        url: url2,
        type: 'GET',
        data: {
            queryId: 'AllFulfillments'
        },
        dataType: 'json',
        success: function(info) {
            resetFulfillmentsTable();
            for (var i = 0; i < info.length; i++) {
                //El valor de las opciones de los select es el ID de los modulos
                var nameFF = info[i].fields.nameFF;
                var idFF = info[i].pk;
                var input = '<input type="checkbox" class="FFInput" data-id-FF="' + idFF + '">';
                tbFulfillments.append('<tr><th>' + input + '</th><th>' + nameFF + '</th></tr>');
            }
        }
    });
}

function resetFulfillmentsTable() {
    tbFulfillments.empty()
}
//funciones vitales
function courseChanged() {
    $('#buttonCreateProject').addClass('disabledDIV');
    $('#promActivity').addClass('disabledDIV');
    $('#finishWork').addClass('disabledDIV');
    $('#buttonDeleteProject').addClass('disabledDIV');
    $('#buttonEditProject').addClass('disabledDIV');
    $('#addActivity').addClass('disabledDIV');
    cleanTableActivities();
    resetModuleField();
    resetProjectFWField();
    resetStudentTable();
    if (this.val != '') {
        $.ajax({
            url: url2,
            type: 'GET',
            data: {
                idCourse: cbxCourse.val(),
                queryId: "subjects"
            },
            dataType: 'json',
            success: function(info) {
                resetModuleField();
                for (var i = 0; i < info.length; i++) {
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

function moduleChanged() {
    $('#buttonCreateProject').addClass('disabledDIV');
    $('#promActivity').addClass('disabledDIV');
    $('#finishWork').addClass('disabledDIV');
    $('#addActivity').addClass('disabledDIV');
    $('#buttonDeleteProject').addClass('disabledDIV');
    $('#buttonEditProject').addClass('disabledDIV');
    cleanTableActivities();
    resetStudentTable();
    resetProjectFWField();
    //Carga de Projectos
    $.ajax({
        url: url2,
        type: 'GET',
        data: {
            module: cbxModule.val(),
            queryId: "projects"
        },
        dataType: 'json',
        success: function(info) {
            for (var i = 0; i < info.length; i++) {
                //El valor de las opciones de los select es el ID de los proyectos
                var nameProject = info[i].fields.nameProject;
                var value = info[i].pk;
                cbxProjectFW.append(new Option(nameProject, value));
            }
            cbxProjectFW.selectpicker('refresh');
        }
    });
    if (cbxModule.val() != "") {
        $('#buttonCreateProject').removeClass('disabledDIV');
    }
}

function projectWorkingChanged() {
    $('#promActivity').addClass('disabledDIV');
    $('#finishWork').addClass('disabledDIV');
    cleanTableActivities();
    resetStudentTable();
    StudentTableCreation();
    $('#buttonDeleteProject').removeClass('disabledDIV');
    $('#buttonEditProject').removeClass('disabledDIV');
    $('#addActivity').removeClass('disabledDIV');
}

function StudentTableCreation() {
    if (this.val != '') {
        //Carga de Alumnos
        $.ajax({
            url: url2,
            type: 'GET',
            data: {
                idModule: cbxModule.val(),
                idProject: cbxProjectFW.val(),
                queryId: "studentsWorking"
            },
            dataType: 'json',
            success: function(info) {
                for (var i = 0; i < info.length; i++) {
                    console.log("211");
                    var texto = info[i].fields.idStudent[1] + " " + info[i].fields.idStudent[2];
                    var value = info[i].fields.idStudent[0];
                    var hasFinish = info[i].fields.hasFinish;
                    if (hasFinish == true) {
                        terminado = "termino"
                    } else {
                        terminado = "no termino"
                    }
                    var elemento = '<tr class="clickable-row" onclick="selectStudentWorking(event,' + value + ')"><td>' + texto + '</td><td>' + terminado + '</td></tr>';
                    tbProjectStudent.append(elemento);
                }
            }
        });
    }

}

function selectStudentWorking(evt, valor) {
    currentStudentSelected = valor;
    tableCreation();
    console.log(currentStudentSelected);

}

function tableCreation(){
  $.ajax({
      url: url2,
      type: 'GET',
      data: {idStudent: currentStudentSelected, idProject: cbxProjectFW.val(),queryId: "getActivities"},
      dataType: 'json',
      success: function(info){
          cleanTableActivities();
          for(var i=0;i<info.length;i++){
              var textName = info[i].fields.idActivity[1];
              var textNOC = info[i].fields.numberOfClasses;
              var textCal = info[i].fields.calification;
              var value = info[i].pk;
              var table = '<tr><td>'+textName+'</td>'+
                              '<td>'+textNOC+'</td>'+
                              '<td class="tdNota">'+"<span style='display:none'>"+textCal+"</span>"+'</td>'+
                              '<td><button data-toggle="modal" onclick="setCurrentActivity('+value+')" data-target="#modalCalificateWork" class="btn btn-default "><span class="glyphicon glyphicon-star"></span></button></td>'+
                              '<td><button data-toggle="modal" onclick="setCurrentActivity('+value+')" data-target="#modalEditWork" class="btn btn-default "><span class="glyphicon glyphicon-edit"></span></button></td>'+
                              '<td><button data-toggle="modal" onclick="setCurrentActivity('+value+')" data-target="#modalDeleteWork" class="btn btn-default botonDel"><span class="glyphicon glyphicon-trash"></span></button></td></tr>';
              $('#tableActivities').append(table);
              $('#promActivity').removeClass('disabledDIV');
              $('#finishWork').removeClass('disabledDIV');

          }
          estrellasEtapa();
      }
  });
}
$("#activitySender").click(
    function() {
        if ($('#nameActivity').val() != "") {
            $.ajax({
                url: url2,
                type: 'GET',
                data: {
                    nameActivity: $('#nameActivity').val(),
                    idProject: $('#cbxProjectFW').val(),
                    queryId: "newActivity"
                },
                success: function() {
                    tableCreation();
                    $('#nameActivity').val("");
                }
            });
        }
    }
);

$("#projectSender").click(
    function() {
        if ($('#projectName').val() != "") {
            var FFexisted = []
            var FFtoCreate = []
            $('.FFInput:checked').each(function() {
                    var createOrNot = $(this).attr('data-id-FF');
                    var nameFf = $(this).attr('data-name-FF');
                    console.log(createOrNot);
                    if (createOrNot == 'crear') {
                        FFtoCreate.push(nameFf);
                    } else {
                        FFexisted.push(createOrNot);
                    }
            });
            console.log(FFexisted);
            console.log(FFtoCreate);
            $.ajax({
                url: url2,
                type: 'GET',
                data: {
                    nameProject: $('#projectName').val(),
                    idModule: $('#cbxModule').val(),
                    FFforCreate: FFtoCreate,
                    FFAlreadyCreated: FFexisted,
                    queryId: "newProject"
                },
                success: function() {
                    moduleChanged();
                    $('#cbxProject').val($('#projectName').val());
                    $('#projectName').val("");
                }
            });
        } else {
            alert("Debe completar el campo.");
        }
    });
$("#projectDeleter").click(
    function() {
        if ($('#cbxProjectFW').val() != "") {
            $.ajax({
                url: url2,
                type: 'GET',
                data: {
                    idProject: $('#cbxProjectFW').val(),
                    queryId: "delProject"
                },
                success: function(info) {
                    moduleChanged();
                    $('#delProjectModalSuccess').modal('show');
                    $('#delProjectResult').text(info);
                }
            });
        }
    });
$("#projectModificator").click(
    function() {
        if ($('#cbxProjectFW').val() != "") {
            $.ajax({
                url: url2,
                type: 'GET',
                data: {
                    idProject: $('#cbxProjectFW').val(),
                    nameProject: $('#editProjectName').val(),
                    queryId: "modProject"
                },
            });
        }
        moduleChanged();
        $('#cbxProject').val($('#projectName').val());
        $('#editProjectName').val("");
    });

function setCurrentActivity(valor) {
    currentActivity = valor;
    console.log(currentActivity);
}

function activityDeleter() {
    $.ajax({
        url: url2,
        type: 'GET',
        data: {
            currentActivity: currentActivity,
            queryId: "delActivities"
        },
        success: function() {
            tableCreation();
            console.log("Puto el que lee(oveja xd)");
        }
    });
}

function activityModify() {
    console.log("xddddddddddd");
    $.ajax({
        url: url2,
        type: 'GET',
        data: {
            newNameWork: $('#inputEditWork').val(),
            newCantDays: $('#inputClassesWork').val(),
            currentActivity: currentActivity,
            queryId: "modActivities"
        },
        success: function() {
            tableCreation();
            $('#inputEditWork').val("");
            $('#inputClassesWork').val("");
            console.log("Puto el que lee(oveja xp)");
        }
    });
}
function calActivities(){
  var cantStars = parseInt(star_rating.siblings('input.rating-value').val());
  console.log(parseInt(star_rating.siblings('input.rating-value').val()));
  $.ajax({
      url: url2,
      type: 'GET',
      data: {newCal: cantStars,currentActivity: currentActivity,queryId: "calActivities"},
      success: function(){
          tableCreation();
          $('#inputCal').val("");
          console.log("Puto el que lee(oveja xp)");
      }
  });
}

function projectFinisher() {
    console.log("cacaaa");

    if (this.val != '') {
        //Carga de Alumnos
        $.ajax({
            url: url2,
            type: 'GET',
            data: {
                idStudent: currentStudentSelected,
                idProject: cbxProjectFW.val(),
                queryId: "finishWorking"
            },
            success: function() {
                console.log("hola");
                resetStudentWorkingTable();
                StudentTableCreation();
            }
        });
    }
}


$("#promActivity").click(
  function promedioNotas(){
      $("#spanStar").empty();
      var avg = 0;
      var amount = 0;
      $(".tdNota").each(
          function(){
              avg += +($(this).text());
              amount++;
          }
      );
      avg /= amount;
      avgNotFloat = Math.trunc(avg);
      for(var i=0;i<avgNotFloat;i++){
          $("#spanStar").append('<span class="fa fa-star fa-5x"></span>');
      }
      var avgOnlyFloat = avg - avgNotFloat;
      if (avgOnlyFloat >= 0.1 && avgOnlyFloat <= 0.9){
          $("#spanStar").append('<span class="fa fa-star-half-o fa-5x"></span>');
      }
      var emptyStar = 5 - avg;
      emptyStar = Math.trunc(emptyStar);
      for (var i=0;i<emptyStar;i++){
          $("#spanStar").append('<span class="fa fa-star-o fa-5x"></span>');
      }
      var avgFinal = parseFloat(avg);
      avgFinal = avgFinal.toFixed(2);
      $("#showProm").text(avgFinal);
  });

function projectNotFinisher() {
    console.log("mierdaaa");

    if (this.val != '') {
        //Carga de Alumnos
        $.ajax({
            url: url2,
            type: 'GET',
            data: {
                idStudent: currentStudentSelected,
                idProject: cbxProjectFW.val(),
                queryId: "notFinishWorking"
            },
            success: function() {
                console.log("chau");
                resetStudentWorkingTable();
                StudentTableCreation();
            }
        });
    }
}



var star_rating = $('.star_rating .fa');
var SetRatingStar = function() {
    return star_rating.each(function() {
        if (parseInt(star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
            return $(this).removeClass('fa-star-o').addClass('fa-star');
        } else {
            return $(this).removeClass('fa-star').addClass('fa-star-o');
        }
    });

};
star_rating.on('click', function() {
    star_rating.siblings('input.rating-value').val($(this).data('rating'));
    return SetRatingStar();
});
function estrellasEtapa(){
    $(".tdNota").each(
        function(){
            for (var i=0; i<($(this).text());i++){
                $(this).append('<span class="fa fa-star fa-2x"></span>');
            }
            var starempty = 5-$(this).text();
            for (var i=0; i<starempty;i++){
                $(this).append('<span class="fa fa-star-o fa-2x"></span>');
            }
        }
    );
}
//funciones de limpieza
function cleanTableActivities() {
    $('#tableActivities').empty();
}

function resetModuleField() {
    cbxModule.empty();
    cbxModule.append(new Option('Módulo', ''));
    cbxModule.selectpicker('refresh');
}

function resetProjectFWField() {
    cbxProjectFW.empty();
    cbxProjectFW.append(new Option('Proyectos', ''));
    cbxProjectFW.selectpicker('refresh');
}

function resetStudentTable() {
    tbProjectStudent.empty();
}

function resetStudentWorkingTable() {
    tbProjectStudent.empty();
}
