const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const markdownIt = require("markdown-it");
const markdownService = require("./markdown.service");

const zipFile = () => {
	const zip = new AdmZip();

	zip.addLocalFile(path.join(__dirname, "data.json"));
	zip.addLocalFile(path.join(__dirname, "presentation.md"));

	zip.writeZip(path.join(__dirname, "test.zip"));
	fs.rename(
		path.join(__dirname, "test.zip"),
		path.join(__dirname, "test.codeprez"),
		(err) => {
			if (err) {
				console.error("Error renaming file:", err);
			} else {
				console.log("File renamed successfully to test.codeprez");
			}
		}
	);
};

const unzipFile = () => {
	const zip = new AdmZip(path.join(__dirname, "test.codeprez"));

	zip.extractAllTo(path.join(__dirname, "test"), true);
	console.log("Files extracted successfully");
};

// unzipFile();

const markdownFilePath = path.join(__dirname, "test", "presentation.md");
const configFilePath = path.join(__dirname, "test", "data.json");


markdownService.getSlidesContent(markdownFilePath)
  .then((slides) => {
    slides.forEach((slide, index) => {
      console.log(`Slide ${index + 1}:\n${slide}\n`);
    });
  }
  ).catch((error) => {
    console.error("Error reading slides:", error);
  }
);

markdownService.readFirstSlideContent(configFilePath)
  .then((config) => {
    console.log("First slide content:", config);
  }).catch((error) => {
    console.error("Error reading first slide content:", error);
  }
);