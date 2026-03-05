package com.EFSRT.EFSRT;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EfsrtApplication {

	public static void main(String[] args) {
		SpringApplication.run(EfsrtApplication.class, args);
	}

}
