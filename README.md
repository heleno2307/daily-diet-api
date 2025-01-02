# Requisitos Funcionais

### Usuários
[x] - Deve ser possível criar um usuário.
[] - Deve ser possível identificar o usuário entre as requisições.

## Refeições
[] - Deve ser possível registrar uma refeição com as seguintes informações:

- Nome.
- Descrição.
- Data e Hora.
- Indicação se está dentro ou não da dieta.

[] - Deve ser possível editar uma refeição, podendo alterar todos os dados acima.
[] - Deve ser possível apagar uma refeição.
[] - Deve ser possível listar todas as refeições de um usuário.
[] - Deve ser possível visualizar uma única refeição.

## Métricas

[] -Deve ser possível recuperar as métricas de um usuário:

- Quantidade total de refeições registradas.
- Quantidade total de refeições dentro da dieta.
- Quantidade total de refeições fora da dieta.
- Melhor sequência de refeições dentro da dieta.

# Requisitos Não Funcionais
[] - O sistema deve garantir a autenticação de usuários para proteger as informações relacionadas às refeições.

[] - As requisições devem ser feitas via API REST.

[] - A aplicação deve garantir persistência dos dados em um banco de dados relacional ou não relacional.

[] - As métricas devem ser calculadas de forma eficiente para garantir performance mesmo com muitos registros.

[] - Deve ser utilizada uma camada de middleware para garantir que somente usuários autenticados possam acessar os recursos protegidos.

# Regras de Negócio
[] - Cada refeição registrada deve estar associada a um usuário.
[] - O usuário só pode visualizar, editar ou apagar as refeições que ele próprio criou.
[] - As métricas devem ser calculadas exclusivamente com base nas refeições do usuário logado.
[] - A melhor sequência de refeições dentro da dieta deve ser contabilizada sem interrupções por refeições fora da dieta.
