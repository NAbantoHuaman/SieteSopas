package com.EFSRT.EFSRT.config;

import com.EFSRT.EFSRT.entity.*;
import com.EFSRT.EFSRT.repository.MesaRepository;
import com.EFSRT.EFSRT.repository.ProductoRepository;
import com.EFSRT.EFSRT.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

        private final MesaRepository mesaRepository;
        private final ProductoRepository productoRepository;
        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                seedMesas();
                seedUsuarios();
                seedProductos();
        }

        private void seedMesas() {
                if (mesaRepository.count() > 0)
                        return;

                for (int i = 1; i <= 24; i++) {
                        int capacidad = (i % 3 == 0) ? 6 : (i % 2 == 0 ? 4 : 2);
                        Mesa mesa = Mesa.builder()
                                        .numero(i)
                                        .capacidad(capacidad)
                                        .estado(EstadoMesa.LIBRE)
                                        .build();
                        mesaRepository.save(mesa);
                }
                log.info("✅ 24 mesas creadas (capacidades: 2, 4, 6)");
        }

        private void seedUsuarios() {
                if (usuarioRepository.existsByEmail("sopas@gmail.com"))
                        return;

                usuarioRepository.save(Usuario.builder()
                                .nombre("Administrador")
                                .email("sopas@gmail.com")
                                .password(passwordEncoder.encode("130404"))
                                .rol(Rol.ADMIN)
                                .build());

                usuarioRepository.save(Usuario.builder()
                                .nombre("Ana García")
                                .email("anfitrion@sigepam.com")
                                .password(passwordEncoder.encode("anfitrion123"))
                                .rol(Rol.ANFITRION)
                                .build());

                usuarioRepository.save(Usuario.builder()
                                .nombre("Chef Marco")
                                .email("cocinero@sigepam.com")
                                .password(passwordEncoder.encode("cocinero123"))
                                .rol(Rol.COCINERO)
                                .build());

                usuarioRepository.save(Usuario.builder()
                                .nombre("Caja Principal")
                                .email("caja@sietesopas.com")
                                .password(passwordEncoder.encode("caja123"))
                                .rol(Rol.CAJERO)
                                .build());

                log.info("✅ Usuarios de prueba creados (admin/anfitrion/cocinero/cajero)");
        }

        private void seedProductos() {
                // Limpiamos productos antiguos para asegurar que los precios de la carta
                // oficial se apliquen
                productoRepository.deleteAll();

                // 1. PARA PICAR
                productoRepository.save(Producto.builder()
                                .nombre("Papas Cremosas")
                                .descripcion("Huancaina y Ocopa al batan con quesitos, aceituna, fresca lechuga, huevos cocidos a punto y criolla.")
                                .categoria("Para Picar")
                                .precio(new java.math.BigDecimal("11.90"))
                                .stock(50).disponible(true)
                                .imagenUrl("/images/generated/papas_cremosas.png").build());

                productoRepository.save(Producto.builder()
                                .nombre("Papa Rellena Crocante")
                                .descripcion("Rellenas con lomito criollo, huevos y bañadas en cremosa huancaina.")
                                .categoria("Para Picar")
                                .precio(new java.math.BigDecimal("7.90"))
                                .stock(45).disponible(true)
                                .imagenUrl("/images/generated/papa_rellena.png").build());

                productoRepository.save(Producto.builder()
                                .nombre("Alitas de 90,000 soles")
                                .descripcion("Maceradas a nuestro estilo, acompañadas de nuestra salsa ganadora la 90,000.")
                                .categoria("Para Picar")
                                .precio(new java.math.BigDecimal("15.90"))
                                .stock(30).disponible(true)
                                .imagenUrl("/images/generated/alitas_90000.png").build());

                productoRepository.save(Producto.builder()
                                .nombre("Tequeños de 3 Quesos")
                                .descripcion("Una mezcla de la casa con Quesos Edam, Manchego y Cheddar con guacamole.")
                                .categoria("Para Picar")
                                .precio(new java.math.BigDecimal("15.90"))
                                .stock(40).disponible(true)
                                .imagenUrl("/images/generated/tequenos_3_quesos.png").build());

                productoRepository.save(Producto.builder()
                                .nombre("Salchipapa Clásica")
                                .descripcion("Un platón para tres, acompañadas de tres tipos de salchichas, chorizo, 2 huevos y todas las cremas.")
                                .categoria("Para Picar")
                                .precio(new java.math.BigDecimal("24.90"))
                                .stock(30).disponible(true)
                                .imagenUrl("/images/generated/salchipapa_clasica.png").build());

                // 2. PASTAS
                productoRepository.save(Producto.builder()
                                .nombre("Fettucini a lo Alfredo")
                                .descripcion("Clásica pasta en salsa blanca cremosa con jamón seleccionado.")
                                .categoria("Pastas")
                                .precio(new java.math.BigDecimal("19.90"))
                                .stock(25).disponible(true)
                                .imagenUrl("/images/generated/fettucini_alfredo.png").build());

                productoRepository.save(Producto.builder()
                                .nombre("Fettucini a la Huancaína")
                                .descripcion("Jugosos tallarines bañados en la tradicional crema a la huancaína de la casa.")
                                .categoria("Pastas")
                                .precio(new java.math.BigDecimal("21.90"))
                                .stock(20).disponible(true)
                                .imagenUrl("/images/generated/fettucini_huancaina.png").build());

                // 3. PARA LOS TENEDORES
                productoRepository.save(Producto.builder()
                                .nombre("Chaufa al Cilindro")
                                .descripcion("Con salchichas, chancho y pollo al cilindro. El favorito de muchos.")
                                .categoria("Para Tenedores")
                                .precio(new java.math.BigDecimal("16.90"))
                                .stock(40).disponible(true)
                                .imagenUrl("/images/generated/chaufa_cilindro.png").build());

                productoRepository.save(Producto.builder()
                                .nombre("Lomo Saltado")
                                .descripcion("Trozos de lomo fino con papas fritas amarillas y arroz blanco.")
                                .categoria("Para Tenedores")
                                .precio(new java.math.BigDecimal("22.90"))
                                .stock(35).disponible(true)
                                .imagenUrl("/images/generated/lomo_saltado.png").build());

                productoRepository.save(Producto.builder()
                                .nombre("Pollo Broaster")
                                .descripcion("Filete de pollo empanizado con papas fritas amarillas y ensalada.")
                                .categoria("Para Tenedores")
                                .precio(new java.math.BigDecimal("18.90"))
                                .stock(30).disponible(true)
                                .imagenUrl("https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800")
                                .build());

                // 4. POLLO A LA BRASA
                productoRepository.save(Producto.builder()
                                .nombre("Combo #1 (1/4 Pollo)")
                                .descripcion("1/4 Pollo con papas fritas y ensalada fresca.")
                                .categoria("Pollo a la Brasa")
                                .precio(new java.math.BigDecimal("17.90"))
                                .stock(50).disponible(true)
                                .imagenUrl("/images/generated/combo_pollo_brasa.png").build());

                productoRepository.save(Producto.builder()
                                .nombre("Combo #2 (1/4 Pollo + Chaufa)")
                                .descripcion("1/4 Pollo con Chaufa y papas fritas.")
                                .categoria("Pollo a la Brasa")
                                .precio(new java.math.BigDecimal("23.90"))
                                .stock(40).disponible(true)
                                .imagenUrl("/images/generated/combo_pollo_chaufa.png").build());

                // 5. SOPAS Y CALDOS
                productoRepository.save(Producto.builder()
                                .nombre("Caldo de Gallina")
                                .descripcion("Tradicional caldo de gallina con fideos, huevo y su presa seleccionada.")
                                .categoria("Sopas")
                                .precio(new java.math.BigDecimal("16.90"))
                                .stock(60).disponible(true)
                                .imagenUrl("/images/siete_sopas/caldo_gallina_v2.png").build());

                productoRepository.save(Producto.builder()
                                .nombre("Sopa Criolla")
                                .descripcion("Tradicional sopa a base de carne, leche, huevo y pan tostado.")
                                .categoria("Sopas")
                                .precio(new java.math.BigDecimal("18.90"))
                                .stock(55).disponible(true)
                                .imagenUrl("/images/siete_sopas/sopa_criolla_original.png").build());

                log.info("✅ Menú Siete Sopas digitalizado completamente con imágenes profesionales");
        }
}
