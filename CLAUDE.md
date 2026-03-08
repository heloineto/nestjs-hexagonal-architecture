## Global

- ALWAYS be extremely concise. Sacrifice grammar for the sake of concision
- IF NEEDED at the end of each plan, give me a list of unresolved questions to answer, if any
- NEVER use em dash "—". use either a dot, comma, space or simple hyphen "-" instead.

## Programming

- ALWAYS write clean and elegant code
- NEVER nest code beyond 3 levels deep. Always refactor using:
  - Early return to kill conditions fast, invert guards
  - Extract nested blocks into separate functions
- NEVER use single-character variable names. BAD: `i` GOOD: `index`
- NEVER do ugly/nested ternaries. Use if/else or extract to a function. BAD: a ? b ? c : d : e GOOD: if/else blocks

### TypeScript

- ALWAYS run `bun run check-types && bun run lint && bun run test:unit` after making changes

### Zod

- BAD: `.nullable().optional()` GOOD: `.nullish()`
- BAD: `.strict()` GOOD: `.strictObject()`
- BAD: `.passthrough()` GOOD: `.looseObject()`

### NestJS

- ALWAYS use barrel imports. `index.ts` must only export same-folder files/folders, never `../` or nested paths
- All IDs must be converted to string. typeorm does it for int8, we do it for int4, int2, etc.
- Always use z.strictObject instead of z.object in DTOs

### This Project (Voto a Voto API)

- No explicit `name` on `@Column`/`@PrimaryColumn`/`@PrimaryGeneratedColumn`/`@CreateDateColumn`/`@JoinColumn` — `SnakeNamingStrategy` handles it. Only `@Entity` and `@JoinTable` need explicit names.
