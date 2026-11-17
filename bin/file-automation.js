#!/usr/bin/env node

import { existsSync } from "node:fs";
import { URL } from "node:url";

import { program } from "commander";

// Файл каркаса, его не меняйте. Ваш код живёт в index.js и src/.
//
// Каркас командной строки готов сразу. Пока в корне проекта нет index.js с функцией
// run({ command, directory, out }), команды только показывают, что аргументы разобраны.
// Наличие файла проверяется заранее: ошибка внутри вашего index.js доходит до вас как есть.
const entry = new URL("../index.js", import.meta.url);

const placeholder = ({ command, directory, out }) => {
  console.log(`Команда ${command}, папка ${directory}, результат в ${out}`);
  console.log("Каркас работает. Логику команд подключит index.js с функцией run.");
};

const { run } = existsSync(entry) ? await import(entry) : { run: placeholder };

const describe = {
  files: "собрать реестр документов папки",
  contacts: "собрать чистую таблицу контактов",
};

program
  .name("file-automation")
  .description("Автоматизация разбора файлов компании")
  .version("1.0.0")
  // Без этого неизвестная команда даёт одну строку «unknown command», и список команд
  // приходится искать самому.
  .showHelpAfterError();

Object.entries(describe).forEach(([command, description]) => {
  program
    .command(command)
    .description(description)
    .argument("<папка>", "папка с файлами компании")
    .option("-o, --out <папка>", "куда положить результат", "./out")
    .action((directory, options) => run({ command, directory, out: options.out }));
});

// Запуск без аргументов объясняет, как пользоваться программой, и это не ошибка.
if (process.argv.length <= 2) {
  program.outputHelp();
} else {
  program.parse();
}
