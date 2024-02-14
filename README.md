# App

GymPass style app.

## RFs (Requisitos Funcionais)

O que é possível do usuário fazer em nossa aplicação:

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil do usuário logado;
- [x] Deve ser possível obter o histórico de check-ins do usuário logado;
- [x] Deve ser possível obter o número de check-ins realizado pelo usuário logado;
- [x] Deve ser possível buscar academias próximas ao usuário logado (até 10km);
- [x] Deve ser possível buscar academias pelo nome com o usuário logado;
- [x] Deve ser possível realizar check-in em uma academia com o usuário logado;
- [x] Deve ser possível validar o check-in de um usuário logado;
- [x] Deve ser possível cadastrar uma academia.

## RNs (Regras de Negócio)

Caminhos que cada requisito pode tomar, todas existem à partir de um Requisito
Funcional:

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-in no mesmo dia (à depender do plano);
- [x] O usuário não pode fazer check-in se não estiver mais de 100m de distância da academia;
- [x] O check-in só pode ser validado em até 20min após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos Não Funcionais)

Requisitos que não partem do cliente, são mais técnicos, como o banco de dados
que vou usar, estratégia de caching, paginação e outros detalhes:

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas as listas de dados precisam estar paginadas com 20 item por página;
- [ ] O usuário tem de ser identificado por um JWT (JSON Web Token);
