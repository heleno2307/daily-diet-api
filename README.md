# Requisitos Funcionais

### Usuários
[x] - Deve ser possível criar um usuário.
[x] - Deve ser possível identificar o usuário entre as requisições.

## Refeições
[x] - Deve ser possível registrar uma refeição com as seguintes informações:

- Nome.
- Descrição.
- Data e Hora.
- Indicação se está dentro ou não da dieta.

[x] - Deve ser possível editar uma refeição, podendo alterar todos os dados acima.
[x] - Deve ser possível apagar uma refeição.
[x] - Deve ser possível listar todas as refeições de um usuário.
[x] - Deve ser possível visualizar uma única refeição.

## Métricas

[x] -Deve ser possível recuperar as métricas de um usuário:

- Quantidade total de refeições registradas.
- Quantidade total de refeições dentro da dieta.
- Quantidade total de refeições fora da dieta.
- Melhor sequência de refeições dentro da dieta.

# Requisitos Não Funcionais
[x] - O sistema deve garantir a autenticação de usuários para proteger as informações relacionadas às refeições.

[x] - As requisições devem ser feitas via API REST.

[x] - A aplicação deve garantir persistência dos dados em um banco de dados relacional ou não relacional.

[x] - As métricas devem ser calculadas de forma eficiente para garantir performance mesmo com muitos registros.

[x] - Deve ser utilizada uma camada de middleware para garantir que somente usuários autenticados possam acessar os recursos protegidos.

# Regras de Negócio
[x] - Cada refeição registrada deve estar associada a um usuário.
[x] - O usuário só pode visualizar, editar ou apagar as refeições que ele próprio criou.
[x] - As métricas devem ser calculadas exclusivamente com base nas refeições do usuário logado.
[x] - A melhor sequência de refeições dentro da dieta deve ser contabilizada sem interrupções por refeições fora da dieta.
