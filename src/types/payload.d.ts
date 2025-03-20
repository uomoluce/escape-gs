declare module 'payload/types' {
  export interface PayloadRequest {
    files?: Express.Multer.File[]
    [key: string]: any
  }

  export interface BeforeChangeData {
    [key: string]: any
  }

  export type BeforeChangeHook = (args: {
    data: BeforeChangeData
    req: PayloadRequest
    operation: 'create' | 'update'
  }) => Promise<BeforeChangeData> | BeforeChangeData
}

declare module 'payload/components/forms' {
  export function useFormFields<T>(selector: (fields: any) => T): T
  export interface FormField extends FieldBase {
    value: any
    initialValue: any
    valid: boolean
  }
}

declare module 'payload/components/fields/File' {
  export interface Props {
    field: {
      accept?: string
      [key: string]: any
    }
    [key: string]: any
  }
}

declare module 'payload' {
  export interface CollectionConfig {
    slug: string
    fields?: Array<{
      name: string
      type: string
      [key: string]: any
    }>
    admin?: {
      hidden?: boolean
      components?: {
        Field?: {
          [key: string]: React.ComponentType<any>
        }
      }
      [key: string]: any
    }
    hooks?: {
      beforeChange?: BeforeChangeHook[]
      [key: string]: any[]
    }
    [key: string]: any
  }

  export function buildConfig(config: any): any
}
