package com.nelioalves.cursomc;


import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.nelioalves.cursomc.statics.PythonScriptRunner;

@SpringBootApplication
public class CursomcApplication {
    public static void main(String[] args) {
        SpringApplication.run(CursomcApplication.class, args);
        TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
        // Execute the Python script
        PythonScriptRunner.runPythonScript();
    }
}
