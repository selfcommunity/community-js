/**
 * Typology of device
 */
export enum SCDeviceTypeEnum {
  ANDROID = 'Android',
  IOS = 'iOS'
}

/**
 * Interface SCDeviceType.
 * Device Schema.
 */
export interface SCDeviceType {
  /**
   * Id of the device
   */
  id?: number;

  /**
   * Device name
   */
  name?: string;

  /**
   * Registration ID
   */
  registration_id: string;

  /**
   * Unique device identifier
   * ANDROID_ID / TelephonyManager.getDeviceId() (always as hex)
   * UUID / UIDevice.identifierForVendor()
   * max_length = 32
   */
  device_id?: number;

  /**
   * Device activated/deactivate
   */
  active?: boolean;

  /**
   * Date of registration
   */
  date_created?: Date | string;

  /**
   * Identifier for the application
   */
  application_id?: string;

  /**
   * Platform
   */
  platform?: SCDeviceTypeEnum;

  /**
   * notification_service
   */
  notification_service?: SCDeviceGcmTypeEnum | SCDeviceApnsTypeEnum;
}

/**
 * Typology of Google Cloud Message Type
 */
export enum SCDeviceGcmTypeEnum {
  GCM = 'GCM',
  FCM = 'FCM'
}

/**
 * Typology of Google Cloud Message Type
 */
export enum SCDeviceApnsTypeEnum {
  APNS = 'APNS'
}

/**
 * Interface SCGcmDeviceType
 * GCMDevice Schema.
 */
export interface SCGcmDeviceType extends SCDeviceType {
  /**
   * Cloud message type: GCM or FCM
   */
  cloud_message_type: SCDeviceGcmTypeEnum;
}

/**
 * Interface SCApnsDeviceType
 * APNSDevice Schema.
 */
export type SCApnsDeviceType = SCDeviceType;
