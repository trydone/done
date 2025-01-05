import {
  ANYONE_CAN,
  type ExpressionBuilder,
  NOBODY_CAN,
  type Row,
  type TableSchema,
  createSchema,
  createTableSchema,
  definePermissions,
} from "@rocicorp/zero";
// @ts-expect-error - no direct import available
import type { Condition } from "@rocicorp/zero/out/zero-protocol/src/ast";

export const enterpriseSchema = createTableSchema({
  tableName: "enterprise",
  columns: {
    id: "string",
    name: "string",
    slug: "string",
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: "id",
});

export const workspaceSchema = {
  tableName: "workspace",
  columns: {
    id: "string",
    name: "string",
    slug: "string",
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: "id",
  relationships: {
    sessionMembers: [
      {
        sourceField: "id",
        destField: "workspace_id",
        destSchema: () => workspaceMemberSchema,
      },
      {
        sourceField: "user_id",
        destField: "user_id",
        destSchema: () => sessionSchema,
      },
    ],
  },
} as const;

export const teamSchema = createTableSchema({
  tableName: "team",
  columns: {
    id: "string",
    name: "string",
    slug: "string",
    workspace_id: "string",
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: "id",
  relationships: {
    workspace: {
      sourceField: "workspace_id",
      destField: "id",
      destSchema: () => workspaceSchema,
    },
  },
});

export const workspaceMemberSchema = {
  tableName: "workspace_member",
  columns: {
    id: "string",
    workspace_id: "string",
    user_id: "string",
    role: "string",
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: "id",
  relationships: {
    workspace: {
      sourceField: "workspace_id",
      destField: "id",
      destSchema: () => workspaceSchema,
    },
    session: {
      sourceField: "user_id",
      destField: "user_id",
      destSchema: () => sessionSchema,
    },
    user: {
      sourceField: "user_id",
      destField: "id",
      destSchema: () => userSchema,
    },
  },
} as const;

export const teamMemberSchema = createTableSchema({
  tableName: "team_member",
  columns: {
    id: "string",
    team_id: "string",
    user_id: "string",
    role: "string",
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: "id",
  relationships: {
    team: {
      sourceField: "team_id",
      destField: "id",
      destSchema: () => teamSchema,
    },
    user: {
      sourceField: "user_id",
      destField: "id",
      destSchema: () => userSchema,
    },
  },
});

export const projectSchema = createTableSchema({
  tableName: "project",
  columns: {
    id: "string",
    name: "string",
    slug: "string",
    description: { type: "string", optional: true },
    workspace_id: "string",
    team_id: { type: "string", optional: true },
    sort_order: "number",
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: "id",
  relationships: {
    workspace: {
      sourceField: "workspace_id",
      destField: "id",
      destSchema: () => workspaceSchema,
    },
    team: {
      sourceField: "team_id",
      destField: "id",
      destSchema: () => teamSchema,
    },
  },
});

export const userSchema = {
  tableName: "user",
  columns: {
    id: "string",
    username: "string",
    email: { type: "string", optional: true },
    name: { type: "string", optional: true },
    avatar: { type: "string", optional: true },
    role: "string",
    github_id: "number",
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: "id",
  relationships: {
    session: {
      sourceField: "id",
      destField: "user_id",
      destSchema: () => sessionSchema,
    },
    workspaceMembers: {
      sourceField: "id",
      destField: "user_id",
      destSchema: () => workspaceMemberSchema,
    },
    workspaces: [
      {
        sourceField: "id",
        destField: "user_id",
        destSchema: () => workspaceMemberSchema,
      },
      {
        sourceField: "workspace_id",
        destField: "id",
        destSchema: () => workspaceSchema,
      },
    ],
  },
} as const;

export const taskSchema = {
  tableName: "task",
  columns: {
    id: "string",
    title: "string",
    description: "string",

    // Organization & sorting
    sort_order: { type: "number", optional: true },
    today_sort_order: { type: "number", optional: true },
    today_index_reference_date: { type: "number", optional: true },

    // Temporal management
    created_at: "number",
    updated_at: "number",
    completed_at: { type: "number", optional: true },
    archived_at: { type: "number", optional: true },

    start: "string",
    start_date: { type: "number", optional: true },
    start_bucket: "string",

    // Deadline management
    deadline_at: { type: "number", optional: true },
    deadline_suppression_at: { type: "number", optional: true },

    // Reminder system
    reminder_at: { type: "number", optional: true },
    last_reminder_interaction_at: { type: "number", optional: true },

    // Relationships
    creator_id: "string",
    workspace_id: "string",
    assignee_id: { type: "string", optional: true },
    project_id: { type: "string", optional: true },
    team_id: { type: "string", optional: true },
  },
  primaryKey: "id",
  relationships: {
    session: {
      sourceField: "creator_id",
      destSchema: () => sessionSchema,
      destField: "user_id",
    },
    workspace: {
      sourceField: "workspace_id",
      destField: "id",
      destSchema: () => workspaceSchema,
    },
    tags: [
      {
        sourceField: "id",
        destField: "task_id",
        destSchema: () => taskTagSchema,
      },
      {
        sourceField: "tag_id",
        destField: "id",
        destSchema: () => tagSchema,
      },
    ],
    comments: {
      sourceField: "id",
      destField: "task_id",
      destSchema: () => taskCommentSchema,
    },
    checklistItems: {
      sourceField: "id",
      destField: "task_id",
      destSchema: () => checklistItemSchema,
    },
    creator: {
      sourceField: "creator_id",
      destField: "id",
      destSchema: () => userSchema,
    },
    assignee: {
      sourceField: "assignee_id",
      destField: "id",
      destSchema: () => userSchema,
    },
    view_state: {
      sourceField: "id",
      destField: "task_id",
      destSchema: () => viewStateSchema,
    },
    emoji: {
      sourceField: "id",
      destField: "subject_id",
      destSchema: () => emojiSchema,
    },
    project: {
      sourceField: "project_id",
      destField: "id",
      destSchema: () => projectSchema,
    },
    team: {
      sourceField: "team_id",
      destField: "id",
      destSchema: () => teamSchema,
    },
  },
} as const;

export const viewStateSchema = createTableSchema({
  tableName: "view_state",
  columns: {
    id: "string",
    task_id: "string",
    user_id: "string",
    viewed_at: "number",
  },
  primaryKey: "id",
});

export const taskCommentSchema = {
  tableName: "task_comment",
  columns: {
    id: "string",
    task_id: "string",
    created_at: "number",
    body: "string",
    creator_id: "string",
  },
  primaryKey: "id",
  relationships: {
    creator: {
      sourceField: "creator_id",
      destField: "id",
      destSchema: () => userSchema,
    },
    emoji: {
      sourceField: "id",
      destField: "subject_id",
      destSchema: () => emojiSchema,
    },
    task: {
      sourceField: "task_id",
      destField: "id",
      destSchema: () => taskSchema,
    },
  },
} as const;

export const checklistItemSchema = {
  tableName: "checklist_item",
  columns: {
    id: "string",
    task_id: "string",
    title: "string",
    sort_order: "number",
    completed_at: { type: "number", optional: true },
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: "id",
  relationships: {
    task: {
      sourceField: "task_id",
      destField: "id",
      destSchema: () => taskSchema,
    },
  },
} as const;

export const tagSchema = createTableSchema({
  tableName: "tag",
  columns: {
    id: "string",
    name: "string",
  },
  primaryKey: "id",
});

export const taskTagSchema = {
  tableName: "task_tag",
  columns: {
    id: "string",
    task_id: "string",
    tag_id: "string",
  },
  primaryKey: "id",
  relationships: {
    task: {
      sourceField: "task_id",
      destField: "id",
      destSchema: () => taskSchema,
    },
  },
} as const;

export const emojiSchema = {
  tableName: "emoji",
  columns: {
    id: "string",
    value: "string",
    annotation: "string",
    subject_id: "string",
    creator_id: "string",
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: "id",
  relationships: {
    creator: {
      sourceField: "creator_id",
      destField: "id",
      destSchema: userSchema,
    },
    task: {
      sourceField: "subject_id",
      destField: "id",
      destSchema: taskSchema,
    },
    task_comment: {
      sourceField: "subject_id",
      destField: "id",
      destSchema: taskCommentSchema,
    },
  },
} as const;

export const sessionSchema = {
  tableName: "session",
  columns: {
    id: "string",
    user_id: "string",
    created_at: "number",
    updated_at: "number",
  },
  primaryKey: ["id", "user_id"],
  relationships: {
    user: {
      sourceField: "user_id",
      destField: "id",
      destSchema: userSchema,
    },
  },
} as const;

export type EnterpriseRow = Row<typeof enterpriseSchema>;
export type WorkspaceRow = Row<typeof workspaceSchema>;
export type TeamRow = Row<typeof teamSchema>;
export type WorkspaceMemberRow = Row<typeof workspaceMemberSchema>;
export type TeamMemberRow = Row<typeof teamMemberSchema>;
export type ProjectRow = Row<typeof projectSchema>;
export type TaskRow = Row<typeof taskSchema>;
export type TagRow = Row<typeof tagSchema>;
export type ChecklistItemRow = Row<typeof checklistItemSchema>;
export type CommentRow = Row<typeof taskCommentSchema>;
export type UserRow = Row<typeof userSchema>;
export type Schema = typeof schema;

/** The contents of the done JWT */
type AuthData = {
  // The logged in user_id.
  sub: string;
  role: "admin" | "user";
};

export const schema = createSchema({
  // If you change this make sure to change /docker/init_upstream/init.sql
  // as well as updating the database on both prod and on sandbox.
  version: 1,

  tables: {
    enterprise: enterpriseSchema,
    workspace: workspaceSchema,
    team: teamSchema,
    project: projectSchema,
    workspace_member: workspaceMemberSchema,
    team_member: teamMemberSchema,
    user: userSchema,
    task: taskSchema,
    task_comment: taskCommentSchema,
    tag: tagSchema,
    task_tag: taskTagSchema,
    view_state: viewStateSchema,
    emoji: emojiSchema,
    session: sessionSchema,
    checklist_item: checklistItemSchema,
  },
});

type PermissionRule<TSchema extends TableSchema> = (
  authData: AuthData,
  eb: ExpressionBuilder<TSchema>,
) => Condition;

function and<TSchema extends TableSchema>(
  ...rules: PermissionRule<TSchema>[]
): PermissionRule<TSchema> {
  return (authData, eb) => eb.and(...rules.map((rule) => rule(authData, eb)));
}

export const permissions: ReturnType<typeof definePermissions> =
  definePermissions<AuthData, Schema>(schema, () => {
    const userIsLoggedIn = (
      authData: AuthData,
      { cmpLit }: ExpressionBuilder<TableSchema>,
    ) => {
      return cmpLit(authData.sub, "IS NOT", null);
    };

    const loggedInUserIsCreator = (
      authData: AuthData,
      eb: ExpressionBuilder<
        typeof taskCommentSchema | typeof emojiSchema | typeof taskSchema
      >,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.cmp("creator_id", "=", authData.sub),
      );

    const allowYourSession = (
      authData: AuthData,
      eb: ExpressionBuilder<typeof sessionSchema>,
    ) => eb.and(userIsLoggedIn(authData, eb), eb.cmp("id", "=", authData.sub));

    const loggedInUserIsAdmin = (
      authData: AuthData,
      eb: ExpressionBuilder<TableSchema>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.cmpLit(authData.role, "=", "admin"),
      );

    const allowIfUserIDMatchesLoggedInUser = (
      authData: AuthData,
      { cmp }: ExpressionBuilder<typeof viewStateSchema>,
    ) => cmp("user_id", "=", authData.sub);

    const allowIfAdminOrTaskCreator = (
      authData: AuthData,
      eb: ExpressionBuilder<typeof taskTagSchema>,
    ) =>
      eb.or(
        loggedInUserIsAdmin(authData, eb),
        eb.exists("task", (iq) =>
          iq.where((eb) => loggedInUserIsCreator(authData, eb)),
        ),
      );

    const allowTask = (
      authData: AuthData,
      eb: ExpressionBuilder<typeof taskSchema>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.exists("session", (session) =>
          session.where("id", "=", authData.sub),
        ),
      );

    const allowWorkspace = (
      authData: AuthData,
      eb: ExpressionBuilder<typeof workspaceSchema>,
    ) => eb.exists("sessionMembers", (q) => q.where("id", "=", authData.sub));

    const allowUser = (
      authData: AuthData,
      eb: ExpressionBuilder<typeof userSchema>,
    ) =>
      eb.and(
        userIsLoggedIn(authData, eb),
        eb.exists("session", (session) =>
          session.where("id", "=", authData.sub),
        ),
      );

    const canSeeTask = (
      authData: AuthData,
      eb: ExpressionBuilder<typeof taskSchema>,
    ) => userIsLoggedIn(authData, eb);

    /**
     * Comments are only visible if the user can see the task they're attached to.
     */
    const canSeeComment = (
      authData: AuthData,
      eb: ExpressionBuilder<typeof taskCommentSchema>,
    ) => eb.exists("task", (q) => q.where((eb) => canSeeTask(authData, eb)));

    /**
     * Task tags are only visible if the user can see the task they're attached to.
     */
    const canSeeTaskTag = (
      authData: AuthData,
      eb: ExpressionBuilder<typeof taskTagSchema>,
    ) => eb.exists("task", (q) => q.where((eb) => canSeeTask(authData, eb)));

    /**
     * Emoji are only visible if the user can see the task they're attached to.
     */
    const canSeeEmoji = (
      authData: AuthData,
      { exists, or }: ExpressionBuilder<typeof emojiSchema>,
    ) =>
      or(
        exists("task", (q) => {
          return q.where((eb) => canSeeTask(authData, eb));
        }),
        exists("task_comment", (q) => {
          return q.where((eb) => canSeeComment(authData, eb));
        }),
      );

    return {
      workspace: {
        // Only the authentication system can write to the user table.
        row: {
          insert: NOBODY_CAN,
          update: {
            preMutation: NOBODY_CAN,
          },
          delete: NOBODY_CAN,
          select: [allowWorkspace],
        },
      },
      user: {
        row: {
          insert: ANYONE_CAN,
          update: ANYONE_CAN,
          delete: ANYONE_CAN,
          // select: [allowUser],
          // insert: NOBODY_CAN,
          // update: {
          //   preMutation: NOBODY_CAN,
          // },
          // delete: NOBODY_CAN,
          // select: [allowUser],
        },
      },
      task: {
        row: {
          insert: ANYONE_CAN,
          update: ANYONE_CAN,
          delete: ANYONE_CAN,
          // insert: [
          //   // prevents setting the creator_id of an task to someone
          //   // other than the user doing the creating
          //   loggedInUserIsCreator,
          // ],
          // update: {
          //   preMutation: [loggedInUserIsCreator, loggedInUserIsAdmin],
          //   postMutation: [loggedInUserIsCreator, loggedInUserIsAdmin],
          // },
          // delete: [loggedInUserIsCreator, loggedInUserIsAdmin],
          // select: [allowTask],
        },
      },
      task_comment: {
        row: {
          insert: [
            loggedInUserIsAdmin,
            and(loggedInUserIsCreator, canSeeComment),
          ],
          update: {
            preMutation: [
              loggedInUserIsAdmin,
              and(loggedInUserIsCreator, canSeeComment),
            ],
          },
          delete: [
            loggedInUserIsAdmin,
            and(canSeeComment, loggedInUserIsCreator),
          ],
        },
      },
      tag: {
        row: {
          insert: [loggedInUserIsAdmin],
          update: {
            preMutation: [loggedInUserIsAdmin],
          },
          delete: [loggedInUserIsAdmin],
        },
      },
      view_state: {
        row: {
          insert: [allowIfUserIDMatchesLoggedInUser],
          update: {
            preMutation: [allowIfUserIDMatchesLoggedInUser],
            postMutation: [allowIfUserIDMatchesLoggedInUser],
          },
          delete: NOBODY_CAN,
        },
      },
      task_tag: {
        row: {
          insert: [and(canSeeTaskTag, allowIfAdminOrTaskCreator)],
          update: {
            preMutation: NOBODY_CAN,
          },
          delete: [and(canSeeTaskTag, allowIfAdminOrTaskCreator)],
        },
      },
      emoji: {
        row: {
          // Can only insert emoji if the can see the task.
          insert: [and(canSeeEmoji, loggedInUserIsCreator)],

          // Can only update their own emoji.
          update: {
            preMutation: [and(canSeeEmoji, loggedInUserIsCreator)],
            postMutation: [and(canSeeEmoji, loggedInUserIsCreator)],
          },
          delete: [and(canSeeEmoji, loggedInUserIsCreator)],
        },
      },
      session: {
        row: {
          delete: [allowYourSession],
          select: [allowYourSession],
        },
      },
    };
  });
