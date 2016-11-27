$(document).ready(function() {

    /////////////////////////////////
    ////////////VARIABLES////////////
    /////////////////////////////////

    var actName = $('#actName');
    var actStatus = $('#actStatus');
    var actClasses = $('#actClasses');
    var actCalification = $('#actCalification');
    var cbxCourse = $('#cbxCourse');
    var cbxModule = $('#cbxModule');
    var cbxProject = $('#cbxProject');
    var cbxPersonalProject = $('#cbxPersonalProject');
    var cbxStudentsActivities = $('#tbStudents > tr > td > select');
    var cbxPersonalActivity = $('#cbxPersonalActivity');
    var checkboxPresence = $('.checkPresence');
    var currentStudentSelected;
    var currentModuleSelected;
    var currentCourseSelected;
    var currentProjectSelected;
    var currentPersonalProjectSelected;
    var date = $('#datepicker');
    var currentDate = date.val();
    var nameStudentHTML = $('.nameStudent');
    var panelPersonalFollowing = $('#personalFollowing');
    var taObservations = $('#taObservations');
    var tbStudents = $('#tbStudents');
    var tbFulfillments = $('#tbFulfillments');
    var tbPersonalFollowing = $('#tbPersonalFollowing');
    var studentRow = $('#studentRow');

    /////////////////////////////////
    /////////////ONCLICK/////////////
    /////////////////////////////////

    //TODO rehacer esta cosa para que no necesite window
    window.presenceChanged = function(element) {
        currentStudentSelected = $(element).closest("tr").attr("id").substr(2);
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                queryId: "savePresence",
                idStudent: currentStudentSelected,
                idModule: currentModuleSelected,
                date: currentDate,
            },
            dataType: 'json'
        });
    }

    window.fulfillmentChanged = function(element) {
        ffId = $(element).closest("tr").attr("id").substr(2);
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                queryId: "saveFulfillment",
                idStudent: currentStudentSelected,
                idModule: currentModuleSelected,
                date: currentDate,
                fulfillmentId: ffId
            },
            dataType: 'json',
            success: function(info) {
                calcFfAc(ffId);
            }
        });
    }

    window.saveActivity = function(element) {
            currentStudentSelected = $(element).closest("tr").attr("id").substr(2);
            activity = $('#tr' + currentStudentSelected + ' > td > select').val();
            if(activity=="--------------"){
                activity="zero";
            }
            $.ajax({
                url: url,
                type: 'GET',
                data: {
                queryId: "saveActivity",
                idStudent: currentStudentSelected,
                idModule: currentModuleSelected,
                activity: activity,
                date: currentDate,
                },
                dataType: 'json',
                success: function(info){

                }
            });
        }
        //TODO rehacer esta cosa para que no necesite window

    taObservations.on('change', function() {
        taObservationsChanged();
    });

    tbStudents.on('click', '.clickable-row', function() {
        $(this).addClass('active').siblings().removeClass('active');
        id = this.id.substr(2);
        selectStudent(id);
    });
    cbxCourse.on('change', function() {
        cbxCourseChanged();
    });
    cbxModule.on('change', function() {
        cbxModuleChanged();
    });
    cbxProject.on('change', function() {
        cbxProjectChanged();
    });
    cbxPersonalProject.on('change', function() {
        cbxPersonalProjectChanged();
    });
    cbxPersonalActivity.on('change', function() {
        cbxPersonalActivityChanged();
    });
    date.on('change', function() {
        if (date.val() == '') {
            date.val(currentDate);
        }
        currentDate = date.val();
        cbxProjectChanged();
    });

    /////////////////////////////////
    ///////FUNCIONES GENERALES///////
    /////////////////////////////////

    function taObservationsChanged() {
        text = taObservations.val();
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                queryId: "saveObservations",
                text: text,
                idModule: currentModuleSelected,
                idStudent: currentStudentSelected,
                date: currentDate,
            },
            dataType: 'json'
        });
    }

    function savePresence() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                queryId: "savePresence",
                idModule: currentModuleSelected,
                idStudent: currentStudentSelected,
                date: currentDate,
            }
        });
    }

    function loadStudentActivities() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                queryId: "getCurrentActivity",
                idModule: currentModuleSelected,
                date: currentDate
            },
            dataType: 'json',
            success: function(data) {
                for (x = 0; x < data.length; x++) {
                    $('#tr' + data[x].studentId + ' option[value="' + data[x].activity + '"]').prop('selected', true);
                }
            }
        });

    }

    function checkCW() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                idModule: currentModuleSelected,
                date: currentDate,
                queryId: "createAllCW"
            },
            dataType: 'json',
        });
    }

    function checkSF() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                idModule: currentModuleSelected,
                date: currentDate,
                queryId: "createAllSF"
            },
            dataType: 'json',
            success: function(info) {
                for (x = 0; x < info.length; x++) {
                    studentPk = info[x].fields.idStudent;
                    studentPresence = info[x].fields.presenceSF;
                    $('#tbStudents > #tr' + studentPk + ' > td > .checkPresence').prop('checked', studentPresence);
                }
                checkCW();
            }
        });
    }

    function checkFF() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                queryId: 'createAllFF',
                idProject: currentProjectSelected,
                idStudent: currentStudentSelected,
                idModule: currentModuleSelected,
                date: currentDate
            },
            dataType: 'json',
            success: function(info) {
                for (x = 0; x < info.length; x++) {
                    pk = info[x].fields.idFF;
                    check = info[x].fields.check;
                    $('#ff' + pk + ' > td > input').prop('checked', check);
                    calcFfAc(pk);
                }
            }
        });
    }

    function calcFfAc(id) {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                queryId: 'calcAccuracy',
                idFF: id,
                idStudent: currentStudentSelected,
                idModule: currentModuleSelected,
                date: currentDate
            },
            dataType: 'json',
            success: function(info) {
                td = $('#ff' + id + ' > .accuracyTd >  p');
                td.text('%' + info);
                if (info > 66) {
                    td.css('color', 'green');
                } else if (info >= 33 && info <= 66) {
                    td.css('color', 'orange');
                } else {
                    td.css('color', 'red');
                }

            }
        });
    }

    function cbxCourseChanged() {
        currentCourseSelected = cbxCourse.val();
        resetCbx(cbxModule, 'Módulo');
        cbxModuleChanged();
        if (cbxCourse.val() != '') {
            chargeCbxModule();
        }
    }

    function cbxModuleChanged() {
        currentModuleSelected = cbxModule.val();
        tbStudents.addClass('disabledDIV');
        resetTable(tbStudents);
        resetCbx(cbxProject, 'Proyecto');
        cbxProjectChanged();
        if (currentModuleSelected != '') {
            chargeCbxProject();
            chargeTbStudents();
        }
    }

    function cbxProjectChanged() {
        tbFulfillments.addClass('disabledDIV');
        tbStudents.addClass('disabledDIV');
        unselectStudents();
        resetCbx(cbxStudentsActivities, '--------------', 'zero');
        selectStudent();
        resetTable(tbFulfillments);
        currentProjectSelected = cbxProject.val();
        if (cbxProject.val() != '') {
            tbStudents.removeClass('disabledDIV');
            chargeTbFulfillments();
            chargeStudentsActivities();
        }
    }

    function cbxPersonalProjectChanged() {
        currentPersonalProjectSelected = cbxPersonalProject.val();
        resetCbx(cbxPersonalActivity, 'Actividades');
        resetActivityData();
        if (currentPersonalProjectSelected != '') {
            chargeCbxPersonalActivities();
        }
    }

    function cbxPersonalActivityChanged() {
        currentPersonalActivitySelected = cbxPersonalActivity.val();
        resetActivityData();
        if (currentPersonalActivitySelected != '') {
            $.ajax({
                type: 'GET',
                url: url,
                data: {
                    idActivity: cbxPersonalActivity.val(),
                    idStudent: currentStudentSelected,
                    queryId: "working"
                },
                dataType: 'json',
                success: function(info) {
                    selectedName = $("#cbxPersonalActivity :selected").text();
                    actName.text(selectedName);
                    if (info[0].fields.hasFinish) {
                        actStatus.css('color', 'green');
                        actStatus.text('Terminado');
                        actCalification.text(info[0].fields.calification);
                    } else {
                        actStatus.css('color', 'orange');
                        actStatus.text('Pendiente');
                    }
                    actClasses.text(info[0].fields.numberOfClasses);
                }
            });
        }
    }

    function selectStudent(value = '') {
        currentStudentSelected = value;
        resetCbx(cbxPersonalActivity, 'Actividades');
        resetCbx(cbxPersonalProject, 'Proyectos');
        resetActivityData();
        resetTextArea(taObservations);
        resetPersonalPanel();
        nameStudentHTML.text('');
        if (currentStudentSelected != '') {
            tbFulfillments.removeClass('disabledDIV');
            checkFF();
            chargeCbxPersonalProject();
            chargePanelsName();
            $.ajax({
                url: url,
                type: 'GET',
                data: {
                    queryId: 'getStudentFollowing',
                    idStudent: currentStudentSelected,
                    idModule: currentModuleSelected,
                    date: currentDate,
                },
                dataType: 'json',
                success: function(info) {
                    taObservations.val(info[0].fields.commentPF);
                }
            });
            panelPersonalFollowing.removeClass('disabledDIV');
        }
    }

    /////////////////////////////////
    ///////FUNCIONES REPETIBLES//////
    /////////////////////////////////
    function chargePanelsName() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                idStudent: currentStudentSelected,
                queryId: 'studentById'
            },
            dataType: 'json',
            success: function(info) {
                nameStudentHTML.text(info[0].fields.name + ' ' + info[0].fields.surname);
            }
        });
    }

    function chargeTbStudents() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                idModule: currentModuleSelected,
                queryId: 'rotationsByModule'
            },
            dataType: 'json',
            success: function(rotationInfo) {
                for (u = 0; u < rotationInfo.length; u++) {
                    $.ajax({
                        url: url,
                        type: 'GET',
                        data: {
                            idRotation: rotationInfo[u].pk,
                            queryId: 'studentsByRotation'
                        },
                        dataType: 'json',
                        success: function(info) {
                            for (var i = 0; i < info.length; i++) {
                                var studentName = info[i].fields.name + " " + info[i].fields.surname;
                                var primaryKey = info[i].pk;
                                var elemento = '<tr class="studentRow clickable-row" id="tr' + primaryKey + '"><td><input type="checkbox" onclick="presenceChanged(this)" class="checkPresence" ></td><td>' + studentName + '</td><td style="text-align:center;"><select onchange="saveActivity(this)"><option>--------------</option></select></td></tr>';
                                tbStudents.append(elemento);
                            }
                            checkSF();
                        }
                    });
                }
            }
        });
    }

    function chargeCbxModule() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                idCourse: currentCourseSelected,
                queryId: 'modulesByCourse'
            },
            dataType: 'json',
            success: function(info) {
                for (var i = 0; i < info.length; i++) {
                    var text = info[i].fields.nameModule;
                    var value = info[i].pk;
                    cbxModule.append(new Option(text, value));
                }
                cbxModule.selectpicker('refresh');
            }
        });
    }

    function chargeCbxPersonalActivities() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                idCourse: currentCourseSelected,
                idProject: currentPersonalProjectSelected,
                queryId: "activitiesByProject"
            },
            dataType: 'json',
            success: function(info) {
                for (var i = 0; i < info.length; i++) {
                    var nameActivity = info[i].fields.nameActivity;
                    var value = info[i].pk;
                    cbxPersonalActivity.append(new Option(nameActivity, value));
                }
                cbxPersonalActivity.selectpicker('refresh');
            }
        });
    }

    function chargeCbxPersonalProject() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                module: currentModuleSelected,
                queryId: 'projectsByModule'
            },
            dataType: 'json',
            success: function(info) {
                for (var i = 0; i < info.length; i++) {
                    var nameProject = info[i].fields.nameProject;
                    var value = info[i].pk;
                    cbxPersonalProject.append(new Option(nameProject, value));
                }
                cbxPersonalProject.selectpicker('refresh');
            }
        });
    }

    function chargeCbxProject() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                module: currentModuleSelected,
                queryId: 'projectsByModule'
            },
            dataType: 'json',
            success: function(info) {
                for (var i = 0; i < info.length; i++) {
                    var nameProject = info[i].fields.nameProject;
                    var value = info[i].pk;
                    cbxProject.append(new Option(nameProject, value));
                }
                cbxProject.selectpicker('refresh');
            }
        });
    }

    function chargeStudentsActivities() {
        $.ajax({
            type: 'GET',
            url: url,
            data: {
                idProject: cbxProject.val(),
                queryId: "activitiesByProject"
            },
            dataType: 'json',
            success: function(info) {
                for (var x = 0; x < info.length; x++) {
                    name = info[x].fields.nameActivity;
                    pk = info[x].pk;
                    $('#tbStudents > tr > td > select').append(new Option(name, pk));
                }
                loadStudentActivities();
            }
        });
    }

    function chargeTbFulfillments() {
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                idProject: cbxProject.val(),
                queryId: "fulfillmentsByProject"
            },
            dataType: 'json',
            success: function(info) {
                for (var x = 0; x < info.length; x++) {
                    nameFF = info[x]['fields']['nameFF'];
                    idFF = info[x]['pk'];
                    var elemento = '<tr id= "ff' + idFF + '"><td><input onclick="fulfillmentChanged(this)" type="checkbox"></td><td>' + nameFF + '</td><td class="accuracyTd" ><p style="font-weight: bold;">%</p></td></tr>';
                    tbFulfillments.append(elemento);
                }
            }
        });
    }

    function unselectStudents() {
        $('#tbStudents > tr').removeClass('active');
    }

    function resetTable(tabla) {
        tabla.empty();
    }

    function resetTextArea(textarea) {
        textarea.val('');
    }

    function resetActivityData() {
        actName.text('---');
        actStatus.text('---');
        actClasses.text('---');
        actCalification.text('---');
    }

    function resetPersonalPanel() {
        resetCbx(cbxPersonalActivity, 'Actividades');
        resetCbx(cbxPersonalProject, 'Proyectos');
        resetActivityData();
        panelPersonalFollowing.addClass('disabledDIV');
    }

    function resetCbx(cbx, unselected, value = '') {
        cbx.empty();
        cbx.append(new Option(unselected, value));
        cbx.selectpicker('refresh');
    }
});
