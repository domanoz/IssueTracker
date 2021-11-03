import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum IssueState {
    OPEN,
    PENDING,
    CLOSED
}

@Entity()
export class Issue {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({
        type: "enum",
        enum: IssueState,
        default: IssueState.OPEN
    })
    state!: IssueState;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}