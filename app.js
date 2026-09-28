/* =====================================================
   GYM PROGRESS
   Sistema de seguimiento de entrenamiento
===================================================== */


/* ============================
   VARIABLES
============================ */

let data = {

    weeks: []

};

let selectedWeekId = null;

let editingExerciseId = null;

let chart = null;


/* ============================
   CARGAR DATOS
============================ */

function loadData() {

    const saved = localStorage.getItem(
        "gymProgressData"
    );

    if (saved) {

        data = JSON.parse(saved);

    }

    render();

}


/* ============================
   GUARDAR DATOS
============================ */

function saveData() {

    localStorage.setItem(
        "gymProgressData",
        JSON.stringify(data)
    );

}


/* ============================
   CREAR ID
============================ */

function generateId() {

    return Date.now().toString()
        + Math.random()
            .toString(36)
            .substring(2);

}


/* ============================
   MODAL SEMANA
============================ */

function openWeekModal() {

    document
        .getElementById("weekModal")
        .classList
        .add("active");

    document
        .getElementById("weekName")
        .value = "";

    document
        .getElementById("weekStart")
        .value = "";

}


function closeWeekModal() {

    document
        .getElementById("weekModal")
        .classList
        .remove("active");

}


/* ============================
   CREAR SEMANA
============================ */

function createWeek() {

    const name =
        document
            .getElementById("weekName")
            .value
            .trim();

    const start =
        document
            .getElementById("weekStart")
            .value;


    if (!name) {

        alert("Escribe un nombre para la semana.");

        return;

    }


    const week = {

        id: generateId(),

        name: name,

        startDate: start,

        exercises: []

    };


    data.weeks.unshift(week);

    saveData();

    closeWeekModal();

    render();

}


/* ============================
   MODAL EJERCICIO
============================ */

function openExerciseModal(
    weekId,
    day = "Lunes",
    exerciseId = null
) {

    selectedWeekId = weekId;

    editingExerciseId = exerciseId;


    document
        .getElementById("exerciseModal")
        .classList
        .add("active");


    if (exerciseId) {

        const week =
            data.weeks.find(
                w => w.id === weekId
            );

        const exercise =
            week.exercises.find(
                e => e.id === exerciseId
            );


        document.getElementById(
            "exerciseDay"
        ).value = exercise.day;

        document.getElementById(
            "exerciseMuscle"
        ).value = exercise.muscle;

        document.getElementById(
            "exerciseName"
        ).value = exercise.name;

        document.getElementById(
            "exerciseMachine"
        ).value = exercise.machine;

        document.getElementById(
            "exerciseWeight"
        ).value = exercise.weight;

        document.getElementById(
            "exerciseSets"
        ).value = exercise.sets;

        document.getElementById(
            "exerciseReps"
        ).value = exercise.reps;

        document.getElementById(
            "exerciseNotes"
        ).value = exercise.notes;


        document.getElementById(
            "exerciseModalTitle"
        ).innerText = "Editar ejercicio";

    }

    else {

        clearExerciseForm();

        document.getElementById(
            "exerciseDay"
        ).value = day;

        document.getElementById(
            "exerciseModalTitle"
        ).innerText = "Agregar ejercicio";

    }

}


function closeExerciseModal() {

    document
        .getElementById("exerciseModal")
        .classList
        .remove("active");

}


/* ============================
   LIMPIAR FORMULARIO
============================ */

function clearExerciseForm() {

    document.getElementById(
        "exerciseDay"
    ).value = "Lunes";

    document.getElementById(
        "exerciseMuscle"
    ).value = "Pecho";

    document.getElementById(
        "exerciseName"
    ).value = "";

    document.getElementById(
        "exerciseMachine"
    ).value = "";

    document.getElementById(
        "exerciseWeight"
    ).value = "";

    document.getElementById(
        "exerciseSets"
    ).value = "";

    document.getElementById(
        "exerciseReps"
    ).value = "";

    document.getElementById(
        "exerciseNotes"
    ).value = "";

}


/* ============================
   GUARDAR EJERCICIO
============================ */

function saveExercise() {

    const week =
        data.weeks.find(
            w => w.id === selectedWeekId
        );


    if (!week) return;


    const exercise = {

        id:
            editingExerciseId
            || generateId(),

        day:
            document
                .getElementById("exerciseDay")
                .value,

        muscle:
            document
                .getElementById("exerciseMuscle")
                .value,

        name:
            document
                .getElementById("exerciseName")
                .value
                .trim(),

        machine:
            document
                .getElementById("exerciseMachine")
                .value
                .trim(),

        weight:
            Number(
                document
                    .getElementById("exerciseWeight")
                    .value
            ) || 0,

        sets:
            Number(
                document
                    .getElementById("exerciseSets")
                    .value
            ) || 0,

        reps:
            Number(
                document
                    .getElementById("exerciseReps")
                    .value
            ) || 0,

        notes:
            document
                .getElementById("exerciseNotes")
                .value
                .trim()

    };


    if (!exercise.name) {

        alert("Escribe el nombre del ejercicio.");

        return;

    }


    if (editingExerciseId) {

        const index =
            week.exercises.findIndex(
                e => e.id === editingExerciseId
            );

        week.exercises[index] = exercise;

    }

    else {

        week.exercises.push(exercise);

    }


    saveData();

    closeExerciseModal();

    render();

}


/* ============================
   ELIMINAR EJERCICIO
============================ */

function deleteExercise(
    weekId,
    exerciseId
) {

    if (
        !confirm(
            "¿Eliminar este ejercicio?"
        )
    ) return;


    const week =
        data.weeks.find(
            w => w.id === weekId
        );


    week.exercises =
        week.exercises.filter(
            e => e.id !== exerciseId
        );


    saveData();

    render();

}


/* ============================
   ELIMINAR SEMANA
============================ */

function deleteWeek(id) {

    if (
        !confirm(
            "¿Eliminar toda esta semana?"
        )
    ) return;


    data.weeks =
        data.weeks.filter(
            w => w.id !== id
        );


    saveData();

    render();

}


/* ============================
   TOGGLE SEMANA
============================ */

function toggleWeek(id) {

    const content =
        document.getElementById(
            "content-" + id
        );

    content.classList.toggle(
        "open"
    );

}


/* ============================
   RENDER PRINCIPAL
============================ */

function render() {

    renderStats();

    renderWeeks();

    renderProgress();

    renderExerciseSelector();

}


/* ============================
   ESTADÍSTICAS
============================ */

function renderStats() {

    const current =
        data.weeks[0];


    document.getElementById(
        "currentWeek"
    ).innerText =
        current
        ? current.name
        : "-";


    let exercises = 0;

    let volume = 0;

    data.weeks.forEach(
        week => {

            exercises +=
                week.exercises.length;


            week.exercises.forEach(
                exercise => {

                    volume +=
                        exercise.weight
                        *
                        exercise.sets
                        *
                        exercise.reps;

                }
            );

        }
    );


    document.getElementById(
        "totalExercises"
    ).innerText = exercises;


    document.getElementById(
        "totalWorkouts"
    ).innerText =
        countTrainingDays();


    document.getElementById(
        "totalVolume"
    ).innerText =
        formatNumber(volume)
        + " kg";

}


function countTrainingDays() {

    let days = 0;

    data.weeks.forEach(
        week => {

            const uniqueDays =
                new Set(
                    week.exercises.map(
                        e => e.day
                    )
                );

            days += uniqueDays.size;

        }
    );

    return days;

}


/* ============================
   SEMANAS
============================ */

function renderWeeks() {

    const container =
        document.getElementById(
            "weeksContainer"
        );


    if (!data.weeks.length) {

        container.innerHTML = `
            <div style="
                padding:40px;
                text-align:center;
                color:#777;
            ">
                Todavía no tienes semanas.
                <br><br>
                Crea tu primera semana para comenzar.
            </div>
        `;

        return;

    }


    container.innerHTML =
        data.weeks.map(
            week => {

                return `

                <div class="week-card">

                    <div class="week-header">

                        <div
                            onclick="toggleWeek('${week.id}')"
                        >

                            <div class="week-title">
                                ${escapeHTML(week.name)}
                            </div>

                            <div class="week-date">
                                ${formatDate(week.startDate)}
                                ·
                                ${week.exercises.length}
                                ejercicios
                            </div>

                        </div>


                        <div class="week-actions">

                            <button
                                class="week-btn add"
                                onclick="
                                openExerciseModal(
                                    '${week.id}'
                                )
                                "
                            >
                                + Ejercicio
                            </button>


                            <button
                                class="week-btn"
                                onclick="
                                deleteWeek(
                                    '${week.id}'
                                )
                                "
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>


                    <div
                        class="week-content"
                        id="content-${week.id}"
                    >

                        ${renderDays(week)}

                    </div>

                </div>

                `;

            }
        ).join("");

}


/* ============================
   DÍAS
============================ */

function renderDays(week) {

    const days = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes"
    ];


    return days.map(
        day => {

            const exercises =
                week.exercises.filter(
                    e => e.day === day
                );


            return `

            <div class="day">

                <div class="day-header">

                    <strong>
                        ${day}
                    </strong>

                    <button
                        class="week-btn add"
                        onclick="
                        openExerciseModal(
                            '${week.id}',
                            '${day}'
                        )
                        "
                    >
                        + Agregar
                    </button>

                </div>


                ${
                    exercises.length
                    ?

                    exercises.map(
                        exercise =>
                        renderExercise(
                            week,
                            exercise
                        )
                    ).join("")

                    :

                    `
                    <div style="
                        padding:15px;
                        color:#666;
                        font-size:13px;
                    ">
                        No hay ejercicios registrados.
                    </div>
                    `
                }

            </div>

            `;

        }
    ).join("");

}


/* ============================
   EJERCICIO
============================ */

function renderExercise(
    week,
    exercise
) {

    return `

    <div class="exercise">

        <div class="exercise-top">

            <div>

                <div class="exercise-name">
                    ${escapeHTML(
                        exercise.name
                    )}
                </div>

                <div class="exercise-muscle">
                    ${escapeHTML(
                        exercise.muscle
                    )}
                </div>

            </div>


            <div class="exercise-actions">

                <button
                    class="small-btn"
                    onclick="
                    openExerciseModal(
                        '${week.id}',
                        '${exercise.day}',
                        '${exercise.id}'
                    )
                    "
                >
                    Editar
                </button>


                <button
                    class="small-btn delete"
                    onclick="
                    deleteExercise(
                        '${week.id}',
                        '${exercise.id}'
                    )
                    "
                >
                    Eliminar
                </button>

            </div>

        </div>


        <div class="exercise-details">

            <span>
                🏋️ ${exercise.weight} kg
            </span>

            <span>
                ${exercise.sets} series
            </span>

            <span>
                ${exercise.reps} reps
            </span>

        </div>


        ${
            exercise.machine
            ?

            `
            <div class="exercise-machine">
                Máquina:
                ${escapeHTML(
                    exercise.machine
                )}
            </div>
            `

            : ""
        }


        ${
            exercise.notes
            ?

            `
            <div class="exercise-notes">
                "${escapeHTML(
                    exercise.notes
                )}"
            </div>
            `

            : ""
        }

    </div>

    `;

}


/* ============================
   PROGRESO POR GRUPO
============================ */

function renderProgress() {

    const table =
        document.getElementById(
            "progressTable"
        );


    if (data.weeks.length < 1) {

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    Agrega una semana para comenzar.
                </td>
            </tr>
        `;

        return;

    }


    const current =
        data.weeks[0];


    const previous =
        data.weeks[1];


    const muscles = [

        "Pecho",
        "Espalda",
        "Hombros",
        "Bíceps",
        "Tríceps",
        "Pierna",
        "Glúteos",
        "Abdomen"

    ];


    table.innerHTML =
        muscles.map(
            muscle => {

                const currentWeight =
                    maxWeightByMuscle(
                        current,
                        muscle
                    );


                const previousWeight =
                    previous
                    ?
                    maxWeightByMuscle(
                        previous,
                        muscle
                    )
                    :
                    0;


                const difference =
                    currentWeight
                    -
                    previousWeight;


                let change = "-";


                if (previous) {

                    if (difference > 0) {

                        change =
                            `
                            <span class="increase">
                                +${difference} kg
                            </span>
                            `;

                    }

                    else if (difference < 0) {

                        change =
                            `
                            <span class="decrease">
                                ${difference} kg
                            </span>
                            `;

                    }

                    else {

                        change =
                            `
                            <span>
                                0 kg
                            </span>
                            `;

                    }

                }


                return `

                <tr>

                    <td>
                        <strong>
                            ${muscle}
                        </strong>
                    </td>

                    <td>
                        ${previousWeight || "-"} kg
                    </td>

                    <td>
                        ${currentWeight || "-"} kg
                    </td>

                    <td>
                        ${change}
                    </td>

                </tr>

                `;

            }
        ).join("");

}


/* ============================
   PESO MÁXIMO POR GRUPO
============================ */

function maxWeightByMuscle(
    week,
    muscle
) {

    const exercises =
        week.exercises.filter(
            e =>
                e.muscle === muscle
        );


    if (!exercises.length)
        return 0;


    return Math.max(
        ...exercises.map(
            e => Number(e.weight) || 0
        )
    );

}


/* ============================
   SELECTOR EJERCICIO
============================ */

function renderExerciseSelector() {

    const selector =
        document.getElementById(
            "exerciseSelector"
        );


    const names = [];


    data.weeks.forEach(
        week => {

            week.exercises.forEach(
                exercise => {

                    if (
                        !names.includes(
                            exercise.name
                        )
                    ) {

                        names.push(
                            exercise.name
                        );

                    }

                }
            );

        }
    );


    selector.innerHTML =
        `
        <option value="">
            Seleccionar ejercicio
        </option>
        `
        +
        names.map(
            name =>
                `
                <option value="${escapeHTML(name)}">
                    ${escapeHTML(name)}
                </option>
                `
        ).join("");

}


/* ============================
   GRÁFICA
============================ */

function updateChart() {

    const exerciseName =
        document.getElementById(
            "exerciseSelector"
        ).value;


    const canvas =
        document.getElementById(
            "progressChart"
        );


    if (chart) {

        chart.destroy();

        chart = null;

    }


    if (!exerciseName)
        return;


    const labels = [];

    const weights = [];


    const weeks =
        [...data.weeks]
            .reverse();


    weeks.forEach(
        week => {

            const exercises =
                week.exercises.filter(
                    e =>
                        e.name ===
                        exerciseName
                );


            if (exercises.length) {

                const max =
                    Math.max(
                        ...exercises.map(
                            e =>
                                Number(
                                    e.weight
                                )
                        )
                    );


                labels.push(
                    week.name
                );

                weights.push(max);

            }

        }
    );


    chart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                exerciseName
                                + " (kg)",

                            data: weights,

                            tension: 0.3,

                            borderWidth: 3,

                            pointRadius: 5

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            labels: {

                                color: "#fff"

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color: "#888"

                            },

                            grid: {

                                color:
                                    "#222"

                            }

                        },

                        y: {

                            ticks: {

                                color: "#888"

                            },

                            grid: {

                                color:
                                    "#222"

                            }

                        }

                    }

                }

            }
        );

}


/* ============================
   FORMATO FECHA
============================ */

function formatDate(date) {

    if (!date)
        return "Sin fecha";


    const d =
        new Date(
            date + "T00:00:00"
        );


    return d.toLocaleDateString(
        "es-CO",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }
    );

}


/* ============================
   NÚMEROS
============================ */

function formatNumber(number) {

    return new Intl.NumberFormat(
        "es-CO"
    ).format(number);

}


/* ============================
   SEGURIDAD HTML
============================ */

function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================
   INICIO
============================ */

loadData();
