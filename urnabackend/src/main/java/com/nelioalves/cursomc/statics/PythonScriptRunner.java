package com.nelioalves.cursomc.statics;

import java.io.IOException;

public class PythonScriptRunner {
    public static void runPythonScript() {
        try {
            // Command to run the Python script
            String pythonCommand = "python";
            String scriptPath = "C:\\MAMP\\htdocs\\projetoPai2\\springboot\\urnabackend\\target\\classes\\script\\agendar.py";
 
            // Create ProcessBuilder
            ProcessBuilder pb = new ProcessBuilder(pythonCommand, scriptPath);

            // Start the process
            Process process = pb.start();

            // Wait for the process to complete
            //int exitCode = process.waitFor();
            System.out.println("Python script exited with code: " );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
