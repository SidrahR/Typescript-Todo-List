#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
let todos = [];
let counter = 0;
async function todo() {
    let loop = true;
    do {
        const input = await inquirer.prompt([
            {
                name: "task",
                type: "input",
                message: `Enter task ${++counter}: `,
                default: null,
            },
            {
                name: "continue",
                type: "confirm",
                message: "Do you want to add another task?",
                default: "Yes",
            },
        ]);
        if (input.task) {
            todos.push(input.task);
        }
        else {
            console.log(chalk.redBright("\n Please enter a valid input\n"));
            --counter;
        }
        if (input.continue == false) {
            await displayList(todos);
            await askOptions();
        }
    } while (loop);
}
function displayList(list) {
    if (list.length > 0) {
        let listNum = 0;
        console.log(chalk.blueBright("\n YOUR TO DO LIST"));
        list.forEach((task) => {
            console.log("  " + ++listNum + ". " + task.charAt(0).toUpperCase() + task.slice(1));
        });
        console.log("\n");
    }
    else {
        console.log(chalk.redBright("\n To do list is empty\n"));
    }
}
async function askOptions() {
    const viewlist = await inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "Do you want to update the list?",
            choices: ["Add Task", "Delete Task", "Exit"],
        },
    ]);
    switch (viewlist.options) {
        case "Add Task":
            await todo();
            break;
        case "Delete Task":
            if (todos.length > 0) {
                todos.forEach((task, num) => {
                    todos[num] = task.charAt(0).toUpperCase() + task.slice(1);
                });
                const deleteTask = await inquirer.prompt([
                    {
                        name: "tasks",
                        type: "list",
                        message: "Which task do you want to delete?",
                        choices: todos,
                    },
                ]);
                todos = todos.filter((e) => e !== deleteTask.tasks);
                await displayList(todos);
                --counter;
                await askOptions();
            }
            else {
                console.log(chalk.redBright("\n To do list is empty\n"));
                await askOptions();
            }
        case "Exit":
            console.log(chalk.greenBright("\n GOOD BYE"));
            process.exit();
    }
}
console.clear();
figlet.text("To Do List", { font: "Chunky" }, (err, data) => {
    if (err) {
        console.log("Something went wrong...");
    }
    console.log(chalk.magentaBright(data), "\n");
    todo();
});
