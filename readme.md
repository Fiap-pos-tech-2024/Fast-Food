# Tech Challenge - Fast Food System

## Descrição do Projeto

O **Tech Challenge** é um projeto desenvolvido como parte da entrega da Pós-Graduação na FIAP. O objetivo é criar um sistema de autoatendimento para uma lanchonete em expansão, que visa melhorar a experiência do cliente e otimizar o gerenciamento de pedidos. O sistema permitirá que os clientes façam pedidos de forma rápida e eficiente, enquanto o estabelecimento poderá gerenciar clientes, produtos e pedidos com mais eficácia.

### Problema

Com o crescimento da lanchonete, a falta de um sistema de controle de pedidos pode levar a confusões e insatisfação dos clientes. Este projeto aborda essas questões, oferecendo uma solução que integra pedidos, pagamentos e acompanhamento em tempo real.

## Funcionalidades

-   **Pedido**: Interface para os clientes montarem seus pedidos de forma intuitiva.
-   ⚠️ **Pagamento**: Integração com o Mercado Pago via QRCode (Fake checkout).
-   ⚠️ **Acompanhamento**: Atualizações em tempo real sobre o status do pedido.
-   ⚠️ **Gerenciamento Administrativo**: Painel para gerenciar clientes e produtos, acompanhar pedidos e implementar campanhas promocionais.

## Estrutura do Projeto

-   **Backend**: Monolito utilizando arquitetura hexagonal.
-   **APIs Implementadas**:
    -   Cadastro do Cliente
    -   Identificação do Cliente via CPF
    -   Criação, edição e remoção de produtos
    -   Busca de produtos por categoria
    -   Fake checkout para processamento de pedidos
    -   Listagem de pedidos
-   **Banco de Dados**: MongoDB para armazenamento das informações dos cliente e pedidos.

## Como Rodar o Projeto Localmente

Para iniciar o projeto, você precisará ter o Docker e o Docker Compose instalados. Siga os passos abaixo:

1. Clone o repositório:

```bash
   git clone git@github.com:Fiap-pos-tech-2024/Fast-Food.git
   cd Fast-Food
```

2. Construa e inicie os containers:

```bash
    docker-compose up --build
```

3. Acesse a aplicação em http://localhost:3000

## Documentação da API

A documentação das APIs está disponível via Swagger. Após iniciar o projeto, você pode acessá-la em http://localhost:3000/api-docs.

## Comandos Kubernetes

Para aplicar os manifestos no Kubernetes, execute os seguintes comandos:

```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
```

Para deletar os recursos no Kubernetes, execute os seguintes comandos:

```bash
kubectl delete -f k8s/deployment.yaml
kubectl delete -f k8s/service.yaml
kubectl delete -f k8s/hpa.yaml
kubectl delete -f k8s/configmap.yaml
kubectl delete -f k8s/secret.yaml
```