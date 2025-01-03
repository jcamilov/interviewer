import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'eden-ai/2.0 (api/6.1.2)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Get a list of all jobs launched for this feature. You'll then be able to use the ID of
   * each one to get its status and results.<br>
   *                             Please note that a **job status doesn't get updated until a
   * get request** is sent.
   *
   * @summary Anonymization List Job
   */
  ocr_anonymization_async_retrieve(): Promise<FetchResponse<200, types.OcrAnonymizationAsyncRetrieveResponse200>> {
    return this.core.fetch('/ocr/anonymization_async', 'get');
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**readyredact**|`v1`|0.05 (per 1 file)|1 file
   * |**base64**|`v1`|0.25 (per 1 page)|1 page
   * |**privateai**|`v3`|0.01 (per 1 page)|1 page
   *
   *
   * </details>
   *
   *
   *
   * @summary Anonymization Launch Job
   */
  ocr_anonymization_async_create(body: types.OcrAnonymizationAsyncCreateBodyParam): Promise<FetchResponse<200, types.OcrAnonymizationAsyncCreateResponse200>> {
    return this.core.fetch('/ocr/anonymization_async', 'post', body);
  }

  /**
   * Generic class to handle method GET all async job for user
   *
   * Attributes:
   *     feature (str): EdenAI feature
   *     subfeature (str): EdenAI subfeature
   *
   * @summary Anonymization delete Jobs
   */
  ocr_anonymization_async_destroy(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/ocr/anonymization_async', 'delete');
  }

  /**
   * Get the status and results of an async job given its ID.
   *
   * @summary Anonymization Get Job Results
   * @throws FetchError<400, types.OcrAnonymizationAsyncRetrieve2Response400>
   * @throws FetchError<403, types.OcrAnonymizationAsyncRetrieve2Response403>
   * @throws FetchError<404, types.OcrAnonymizationAsyncRetrieve2Response404>
   * @throws FetchError<500, types.OcrAnonymizationAsyncRetrieve2Response500>
   */
  ocr_anonymization_async_retrieve_2(metadata: types.OcrAnonymizationAsyncRetrieve2MetadataParam): Promise<FetchResponse<200, types.OcrAnonymizationAsyncRetrieve2Response200>> {
    return this.core.fetch('/ocr/anonymization_async/{public_id}', 'get', metadata);
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**base64**|`latest`|0.25 (per 1 page)|1 page
   * |**veryfi**|`v8`|0.16 (per 1 request)|1 request
   * |**mindee**|`v1`|0.1 (per 1 page)|1 page
   * |**extracta**|`v1`|0.1 (per 1 page)|1 page
   *
   *
   * </details>
   *
   *
   *
   * @summary Bank Check Parsing
   * @throws FetchError<400, types.OcrBankCheckParsingCreateResponse400>
   * @throws FetchError<403, types.OcrBankCheckParsingCreateResponse403>
   * @throws FetchError<404, types.OcrBankCheckParsingCreateResponse404>
   * @throws FetchError<500, types.OcrBankCheckParsingCreateResponse500>
   */
  ocr_bank_check_parsing_create(body: types.OcrBankCheckParsingCreateBodyParam): Promise<FetchResponse<200, types.OcrBankCheckParsingCreateResponse200>> {
    return this.core.fetch('/ocr/bank_check_parsing', 'post', body);
  }

  /**
   * Get a list of all jobs launched for this feature. You'll then be able to use the ID of
   * each one to get its status and results.<br>
   *                             Please note that a **job status doesn't get updated until a
   * get request** is sent.
   *
   * @summary Custom Document Parsing List Job
   */
  ocr_custom_document_parsing_async_retrieve(): Promise<FetchResponse<200, types.OcrCustomDocumentParsingAsyncRetrieveResponse200>> {
    return this.core.fetch('/ocr/custom_document_parsing_async', 'get');
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**amazon**|`boto3 1.26.8`|15.0 (per 1000 page)|1 page
   * |**extracta**|`v1`|0.1 (per 1 page)|1 page
   *
   *
   * </details>
   *
   * <details><summary>Supported Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**English**|`en`|
   * |**French**|`fr`|
   * |**German**|`de`|
   * |**Italian**|`it`|
   * |**Portuguese**|`pt`|
   * |**Spanish**|`es`|
   *
   * </details>
   *
   * @summary Custom Document Parsing Launch Job
   */
  ocr_custom_document_parsing_async_create(body: types.OcrCustomDocumentParsingAsyncCreateBodyParam): Promise<FetchResponse<200, types.OcrCustomDocumentParsingAsyncCreateResponse200>> {
    return this.core.fetch('/ocr/custom_document_parsing_async', 'post', body);
  }

  /**
   * Generic class to handle method GET all async job for user
   *
   * Attributes:
   *     feature (str): EdenAI feature
   *     subfeature (str): EdenAI subfeature
   *
   * @summary Custom Document Parsing delete Jobs
   */
  ocr_custom_document_parsing_async_destroy(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/ocr/custom_document_parsing_async', 'delete');
  }

  /**
   * Get the status and results of an async job given its ID.
   *
   * @summary Custom Document Parsing Get Job Results
   * @throws FetchError<400, types.OcrCustomDocumentParsingAsyncRetrieve2Response400>
   * @throws FetchError<403, types.OcrCustomDocumentParsingAsyncRetrieve2Response403>
   * @throws FetchError<404, types.OcrCustomDocumentParsingAsyncRetrieve2Response404>
   * @throws FetchError<500, types.OcrCustomDocumentParsingAsyncRetrieve2Response500>
   */
  ocr_custom_document_parsing_async_retrieve_2(metadata: types.OcrCustomDocumentParsingAsyncRetrieve2MetadataParam): Promise<FetchResponse<200, types.OcrCustomDocumentParsingAsyncRetrieve2Response200>> {
    return this.core.fetch('/ocr/custom_document_parsing_async/{public_id}', 'get', metadata);
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**amazon**|`boto3 (v1.15.18)`|0.05 (per 1 page)|1 page
   * |**base64**|`latest`|0.25 (per 1 page)|1 page
   *
   *
   * </details>
   *
   *
   *
   * @summary Data Extraction
   * @throws FetchError<400, types.OcrDataExtractionCreateResponse400>
   * @throws FetchError<403, types.OcrDataExtractionCreateResponse403>
   * @throws FetchError<404, types.OcrDataExtractionCreateResponse404>
   * @throws FetchError<500, types.OcrDataExtractionCreateResponse500>
   */
  ocr_data_extraction_create(body: types.OcrDataExtractionCreateBodyParam): Promise<FetchResponse<200, types.OcrDataExtractionCreateResponse200>> {
    return this.core.fetch('/ocr/data_extraction', 'post', body);
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Document Type|Price|Billing unit|
   * |----|-------|------|-----|------------|
   * |**affinda**|`v3`|`invoice`|0.08 (per 1 page)|1 page
   * |**affinda**|`v3`|`receipt`|0.07 (per 1 page)|1 page
   * |**amazon**|`boto3 1.26.8`|-|0.01 (per 1 page)|1 page
   * |**base64**|`latest`|-|0.25 (per 1 page)|1 page
   * |**google**|`DocumentAI v1 beta3`|-|0.01 (per 1 page)|10 page
   * |**klippa**|`v1`|-|0.1 (per 1 file)|1 file
   * |**microsoft**|`rest API 4.0 (2024-02-29-preview)`|-|0.01 (per 1 page)|1 page
   * |**mindee**|`v1.2`|-|0.1 (per 1 page)|1 page
   * |**tabscanner**|`latest`|-|0.08 (per 1 page)|1 page
   * |**veryfi**|`v8`|`receipt`|0.08 (per 1 file)|1 file
   * |**veryfi**|`v8`|`invoice`|0.16 (per 1 file)|1 file
   * |**eagledoc**|`v1`|-|0.03 (per 1 page)|1 page
   * |**extracta**|`v1`|-|0.1 (per 1 page)|1 page
   * |**openai**|`v1.0`|-|15.0 (per 1000000 token)|1 token
   *
   *
   * </details>
   *
   * <details><summary>Supported Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Afrikaans**|`af`|
   * |**Albanian**|`sq`|
   * |**Amharic**|`am`|
   * |**Arabic**|`ar`|
   * |**Armenian**|`hy`|
   * |**Azerbaijani**|`az`|
   * |**Basque**|`eu`|
   * |**Belarusian**|`be`|
   * |**Bengali**|`bn`|
   * |**Bosnian**|`bs`|
   * |**Bulgarian**|`bg`|
   * |**Burmese**|`my`|
   * |**Catalan**|`ca`|
   * |**Cebuano**|`ceb`|
   * |**Chinese**|`zh`|
   * |**Corsican**|`co`|
   * |**Croatian**|`hr`|
   * |**Czech**|`cs`|
   * |**Danish**|`da`|
   * |**Dutch**|`nl`|
   * |**English**|`en`|
   * |**Esperanto**|`eo`|
   * |**Estonian**|`et`|
   * |**Finnish**|`fi`|
   * |**French**|`fr`|
   * |**Galician**|`gl`|
   * |**Georgian**|`ka`|
   * |**German**|`de`|
   * |**Gujarati**|`gu`|
   * |**Haitian**|`ht`|
   * |**Hausa**|`ha`|
   * |**Hawaiian**|`haw`|
   * |**Hebrew**|`he`|
   * |**Hindi**|`hi`|
   * |**Hmong**|`hmn`|
   * |**Hungarian**|`hu`|
   * |**Icelandic**|`is`|
   * |**Igbo**|`ig`|
   * |**Indonesian**|`id`|
   * |**Irish**|`ga`|
   * |**Italian**|`it`|
   * |**Japanese**|`ja`|
   * |**Javanese**|`jv`|
   * |**Kannada**|`kn`|
   * |**Kazakh**|`kk`|
   * |**Khmer**|`km`|
   * |**Kinyarwanda**|`rw`|
   * |**Kirghiz**|`ky`|
   * |**Korean**|`ko`|
   * |**Kurdish**|`ku`|
   * |**Lao**|`lo`|
   * |**Latin**|`la`|
   * |**Latvian**|`lv`|
   * |**Lithuanian**|`lt`|
   * |**Luxembourgish**|`lb`|
   * |**Macedonian**|`mk`|
   * |**Malagasy**|`mg`|
   * |**Malay (macrolanguage)**|`ms`|
   * |**Malayalam**|`ml`|
   * |**Maltese**|`mt`|
   * |**Maori**|`mi`|
   * |**Marathi**|`mr`|
   * |**Modern Greek (1453-)**|`el`|
   * |**Mongolian**|`mn`|
   * |**Nepali (macrolanguage)**|`ne`|
   * |**Norwegian**|`no`|
   * |**Nyanja**|`ny`|
   * |**Oriya (macrolanguage)**|`or`|
   * |**Panjabi**|`pa`|
   * |**Persian**|`fa`|
   * |**Polish**|`pl`|
   * |**Portuguese**|`pt`|
   * |**Pushto**|`ps`|
   * |**Romanian**|`ro`|
   * |**Russian**|`ru`|
   * |**Samoan**|`sm`|
   * |**Scottish Gaelic**|`gd`|
   * |**Serbian**|`sr`|
   * |**Shona**|`sn`|
   * |**Sindhi**|`sd`|
   * |**Sinhala**|`si`|
   * |**Slovak**|`sk`|
   * |**Slovenian**|`sl`|
   * |**Somali**|`so`|
   * |**Southern Sotho**|`st`|
   * |**Spanish**|`es`|
   * |**Sundanese**|`su`|
   * |**Swahili (macrolanguage)**|`sw`|
   * |**Swedish**|`sv`|
   * |**Tagalog**|`tl`|
   * |**Tajik**|`tg`|
   * |**Tamil**|`ta`|
   * |**Tatar**|`tt`|
   * |**Telugu**|`te`|
   * |**Thai**|`th`|
   * |**Turkish**|`tr`|
   * |**Turkmen**|`tk`|
   * |**Uighur**|`ug`|
   * |**Ukrainian**|`uk`|
   * |**Urdu**|`ur`|
   * |**Uzbek**|`uz`|
   * |**Vietnamese**|`vi`|
   * |**Welsh**|`cy`|
   * |**Western Frisian**|`fy`|
   * |**Xhosa**|`xh`|
   * |**Yiddish**|`yi`|
   * |**Yoruba**|`yo`|
   * |**Zulu**|`zu`|
   *
   * </details><details><summary>Supported Detailed Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Auto detection**|`auto-detect`|
   * |**Catalan (Spain)**|`ca-ES`|
   * |**Chinese (China)**|`zh-CN`|
   * |**Chinese (China)**|`zh-cn`|
   * |**Chinese (Taiwan)**|`zh-TW`|
   * |**Chinese (Taiwan)**|`zh-tw`|
   * |**Danish (Denmark)**|`da-DK`|
   * |**Dutch (Netherlands)**|`nl-NL`|
   * |**English (United Kingdom)**|`en-GB`|
   * |**English (United States)**|`en-US`|
   * |**French (Canada)**|`fr-CA`|
   * |**French (France)**|`fr-FR`|
   * |**French (Switzerland)**|`fr-CH`|
   * |**German (Germany)**|`de-DE`|
   * |**German (Switzerland)**|`de-CH`|
   * |**Italian (Italy)**|`it-IT`|
   * |**Italian (Switzerland)**|`it-CH`|
   * |**Portuguese (Portugal)**|`pt-PT`|
   * |**Spanish (Spain)**|`es-ES`|
   *
   * </details>
   *
   * @summary Financial Parser
   * @throws FetchError<400, types.OcrFinancialParserCreateResponse400>
   * @throws FetchError<403, types.OcrFinancialParserCreateResponse403>
   * @throws FetchError<404, types.OcrFinancialParserCreateResponse404>
   * @throws FetchError<500, types.OcrFinancialParserCreateResponse500>
   */
  ocr_financial_parser_create(body: types.OcrFinancialParserCreateBodyParam): Promise<FetchResponse<200, types.OcrFinancialParserCreateResponse200>> {
    return this.core.fetch('/ocr/financial_parser', 'post', body);
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**amazon**|`boto3 (v1.15.18)`|0.025 (per 1 page)|1 page
   * |**base64**|`latest`|0.2 (per 1 page)|1 page
   * |**microsoft**|`rest API 4.0 (2024-02-29-preview)`|0.01 (per 1 page)|1 page
   * |**mindee**|`v2`|0.1 (per 1 page)|1 page
   * |**klippa**|`v1`|0.1 (per 1 file)|1 file
   * |**affinda**|`v3`|0.07 (per 1 file)|1 file
   * |**openai**|`v1`|15.0 (per 1000000 token)|1 token
   *
   *
   * </details>
   *
   * <details><summary>Supported Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Afrikaans**|`af`|
   * |**Albanian**|`sq`|
   * |**Arabic**|`ar`|
   * |**Bengali**|`bn`|
   * |**Bulgarian**|`bg`|
   * |**Chinese**|`zh`|
   * |**Croatian**|`hr`|
   * |**Czech**|`cs`|
   * |**Danish**|`da`|
   * |**Dutch**|`nl`|
   * |**English**|`en`|
   * |**Estonian**|`et`|
   * |**Finnish**|`fi`|
   * |**French**|`fr`|
   * |**German**|`de`|
   * |**Gujarati**|`gu`|
   * |**Hebrew**|`he`|
   * |**Hindi**|`hi`|
   * |**Hungarian**|`hu`|
   * |**Indonesian**|`id`|
   * |**Italian**|`it`|
   * |**Japanese**|`ja`|
   * |**Kannada**|`kn`|
   * |**Korean**|`ko`|
   * |**Latvian**|`lv`|
   * |**Lithuanian**|`lt`|
   * |**Macedonian**|`mk`|
   * |**Malayalam**|`ml`|
   * |**Marathi**|`mr`|
   * |**Modern Greek (1453-)**|`el`|
   * |**Nepali (macrolanguage)**|`ne`|
   * |**Norwegian**|`no`|
   * |**Panjabi**|`pa`|
   * |**Persian**|`fa`|
   * |**Polish**|`pl`|
   * |**Portuguese**|`pt`|
   * |**Romanian**|`ro`|
   * |**Russian**|`ru`|
   * |**Slovak**|`sk`|
   * |**Slovenian**|`sl`|
   * |**Somali**|`so`|
   * |**Spanish**|`es`|
   * |**Swahili (macrolanguage)**|`sw`|
   * |**Swedish**|`sv`|
   * |**Tagalog**|`tl`|
   * |**Tamil**|`ta`|
   * |**Telugu**|`te`|
   * |**Thai**|`th`|
   * |**Turkish**|`tr`|
   * |**Ukrainian**|`uk`|
   * |**Urdu**|`ur`|
   * |**Vietnamese**|`vi`|
   *
   * </details><details><summary>Supported Detailed Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Auto detection**|`auto-detect`|
   * |**Chinese (China)**|`zh-cn`|
   * |**Chinese (Taiwan)**|`zh-tw`|
   * |**English (United States)**|`en-US`|
   * |**French (France)**|`fr-FR`|
   * |**German (Germany)**|`de-DE`|
   * |**Italian (Italy)**|`it-IT`|
   * |**Portuguese (Portugal)**|`pt-PT`|
   * |**Spanish (Spain)**|`es-ES`|
   *
   * </details>
   *
   * @summary Identity Parser
   * @throws FetchError<400, types.OcrIdentityParserCreateResponse400>
   * @throws FetchError<403, types.OcrIdentityParserCreateResponse403>
   * @throws FetchError<404, types.OcrIdentityParserCreateResponse404>
   * @throws FetchError<500, types.OcrIdentityParserCreateResponse500>
   */
  ocr_identity_parser_create(body: types.OcrIdentityParserCreateBodyParam): Promise<FetchResponse<200, types.OcrIdentityParserCreateResponse200>> {
    return this.core.fetch('/ocr/identity_parser', 'post', body);
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**affinda**|`v3`|0.08 (per 1 page)|1 page
   * |**base64**|`latest`|0.25 (per 1 page)|1 page
   * |**microsoft**|`rest API 4.0 (2024-02-29-preview)`|0.01 (per 1 page)|1 page
   * |**mindee**|`v2`|0.1 (per 1 page)|1 page
   * |**amazon**|`boto3 1.26.8`|0.01 (per 1 page)|1 page
   * |**google**|`DocumentAI v1 beta3`|0.01 (per 1 page)|10 page
   * |**klippa**|`v1`|0.1 (per 1 file)|1 file
   * |**veryfi**|`v8`|0.16 (per 1 file)|1 file
   * |**eagledoc**|`v1`|0.03 (per 1 page)|1 page
   *
   *
   * </details>
   *
   * <details><summary>Supported Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Afrikaans**|`af`|
   * |**Albanian**|`sq`|
   * |**Arabic**|`ar`|
   * |**Bengali**|`bn`|
   * |**Bulgarian**|`bg`|
   * |**Catalan**|`ca`|
   * |**Chinese**|`zh`|
   * |**Croatian**|`hr`|
   * |**Czech**|`cs`|
   * |**Danish**|`da`|
   * |**Dutch**|`nl`|
   * |**English**|`en`|
   * |**Estonian**|`et`|
   * |**Finnish**|`fi`|
   * |**French**|`fr`|
   * |**German**|`de`|
   * |**Gujarati**|`gu`|
   * |**Hebrew**|`he`|
   * |**Hindi**|`hi`|
   * |**Hungarian**|`hu`|
   * |**Indonesian**|`id`|
   * |**Italian**|`it`|
   * |**Japanese**|`ja`|
   * |**Kannada**|`kn`|
   * |**Korean**|`ko`|
   * |**Latvian**|`lv`|
   * |**Lithuanian**|`lt`|
   * |**Macedonian**|`mk`|
   * |**Malayalam**|`ml`|
   * |**Marathi**|`mr`|
   * |**Modern Greek (1453-)**|`el`|
   * |**Nepali (macrolanguage)**|`ne`|
   * |**Norwegian**|`no`|
   * |**Panjabi**|`pa`|
   * |**Persian**|`fa`|
   * |**Polish**|`pl`|
   * |**Portuguese**|`pt`|
   * |**Romanian**|`ro`|
   * |**Russian**|`ru`|
   * |**Slovak**|`sk`|
   * |**Slovenian**|`sl`|
   * |**Somali**|`so`|
   * |**Spanish**|`es`|
   * |**Swahili (macrolanguage)**|`sw`|
   * |**Swedish**|`sv`|
   * |**Tagalog**|`tl`|
   * |**Tamil**|`ta`|
   * |**Telugu**|`te`|
   * |**Thai**|`th`|
   * |**Turkish**|`tr`|
   * |**Ukrainian**|`uk`|
   * |**Urdu**|`ur`|
   * |**Vietnamese**|`vi`|
   *
   * </details><details><summary>Supported Detailed Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Auto detection**|`auto-detect`|
   * |**Chinese (China)**|`zh-cn`|
   * |**Chinese (Taiwan)**|`zh-tw`|
   * |**Danish (Denmark)**|`da-DK`|
   * |**English (United States)**|`en-US`|
   * |**French (France)**|`fr-FR`|
   * |**German (Germany)**|`de-DE`|
   * |**Italian (Italy)**|`it-IT`|
   * |**Portuguese (Portugal)**|`pt-PT`|
   * |**Spanish (Spain)**|`es-ES`|
   *
   * </details><strong style='color:red;'>**Note:**</strong> This feature is likely to be
   * deprecated in future releases. It is recommended to use the `financial_parser` feature
   * as an alternative.
   *
   * @summary Invoice Parser
   * @throws FetchError<400, types.OcrInvoiceParserCreateResponse400>
   * @throws FetchError<403, types.OcrInvoiceParserCreateResponse403>
   * @throws FetchError<404, types.OcrInvoiceParserCreateResponse404>
   * @throws FetchError<500, types.OcrInvoiceParserCreateResponse500>
   */
  ocr_invoice_parser_create(body: types.OcrInvoiceParserCreateBodyParam): Promise<FetchResponse<200, types.OcrInvoiceParserCreateResponse200>> {
    return this.core.fetch('/ocr/invoice_parser', 'post', body);
  }

  /**
   * Get a list of all jobs launched for this feature. You'll then be able to use the ID of
   * each one to get its status and results.<br>
   *                             Please note that a **job status doesn't get updated until a
   * get request** is sent.
   *
   * @summary Invoice Splitter List Job
   */
  ocr_invoice_splitter_async_retrieve(): Promise<FetchResponse<200, types.OcrInvoiceSplitterAsyncRetrieveResponse200>> {
    return this.core.fetch('/ocr/invoice_splitter_async', 'get');
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**mindee**|`v1`|0.1 (per 1 page)|1 page
   *
   *
   * </details>
   *
   *
   *
   * @summary Invoice Splitter Launch Job
   */
  ocr_invoice_splitter_async_create(body: types.OcrInvoiceSplitterAsyncCreateBodyParam): Promise<FetchResponse<200, types.OcrInvoiceSplitterAsyncCreateResponse200>> {
    return this.core.fetch('/ocr/invoice_splitter_async', 'post', body);
  }

  /**
   * Generic class to handle method GET all async job for user
   *
   * Attributes:
   *     feature (str): EdenAI feature
   *     subfeature (str): EdenAI subfeature
   *
   * @summary Invoice Splitter delete Jobs
   */
  ocr_invoice_splitter_async_destroy(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/ocr/invoice_splitter_async', 'delete');
  }

  /**
   * Get the status and results of an async job given its ID.
   *
   * @summary Invoice Splitter Get Job Results
   * @throws FetchError<400, types.OcrInvoiceSplitterAsyncRetrieve2Response400>
   * @throws FetchError<403, types.OcrInvoiceSplitterAsyncRetrieve2Response403>
   * @throws FetchError<404, types.OcrInvoiceSplitterAsyncRetrieve2Response404>
   * @throws FetchError<500, types.OcrInvoiceSplitterAsyncRetrieve2Response500>
   */
  ocr_invoice_splitter_async_retrieve_2(metadata: types.OcrInvoiceSplitterAsyncRetrieve2MetadataParam): Promise<FetchResponse<200, types.OcrInvoiceSplitterAsyncRetrieve2Response200>> {
    return this.core.fetch('/ocr/invoice_splitter_async/{public_id}', 'get', metadata);
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**amazon**|`boto3 (v1.15.18)`|1.5 (per 1000 page)|1 page
   * |**clarifai**|`8.0.0`|2.0 (per 1000 page)|1 page
   * |**google**|`v1`|1.5 (per 1000 page)|1 page
   * |**microsoft**|`v3.2`|1.0 (per 1000 page)|1 page
   * |**sentisight**|`v3.3.1`|0.75 (per 1000 file)|1 file
   * |**api4ai**|`v1.0.0`|3.0 (per 1000 request)|1 request
   *
   *
   * </details>
   *
   * <details><summary>Supported Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Abaza**|`abq`|
   * |**Adyghe**|`ady`|
   * |**Afrikaans**|`af`|
   * |**Albanian**|`sq`|
   * |**Angika**|`anp`|
   * |**Arabic**|`ar`|
   * |**Assamese**|`as`|
   * |**Asturian**|`ast`|
   * |**Avaric**|`av`|
   * |**Awadhi**|`awa`|
   * |**Azerbaijani**|`az`|
   * |**Bagheli**|`bfy`|
   * |**Basque**|`eu`|
   * |**Belarusian**|`be`|
   * |**Bengali**|`bn`|
   * |**Bhojpuri**|`bho`|
   * |**Bihari languages**|`bh`|
   * |**Bislama**|`bi`|
   * |**Bodo (India)**|`brx`|
   * |**Bosnian**|`bs`|
   * |**Braj**|`bra`|
   * |**Breton**|`br`|
   * |**Bulgarian**|`bg`|
   * |**Bundeli**|`bns`|
   * |**Buriat**|`bua`|
   * |**Camling**|`rab`|
   * |**Catalan**|`ca`|
   * |**Cebuano**|`ceb`|
   * |**Chamorro**|`ch`|
   * |**Chechen**|`ce`|
   * |**Chhattisgarhi**|`hne`|
   * |**Chinese**|`zh`|
   * |**Cornish**|`kw`|
   * |**Corsican**|`co`|
   * |**Crimean Tatar**|`crh`|
   * |**Croatian**|`hr`|
   * |**Czech**|`cs`|
   * |**Danish**|`da`|
   * |**Dargwa**|`dar`|
   * |**Dari**|`prs`|
   * |**Dhimal**|`dhi`|
   * |**Dogri (macrolanguage)**|`doi`|
   * |**Dutch**|`nl`|
   * |**English**|`en`|
   * |**Erzya**|`myv`|
   * |**Estonian**|`et`|
   * |**Faroese**|`fo`|
   * |**Fijian**|`fj`|
   * |**Filipino**|`fil`|
   * |**Finnish**|`fi`|
   * |**French**|`fr`|
   * |**Friulian**|`fur`|
   * |**Gagauz**|`gag`|
   * |**Galician**|`gl`|
   * |**German**|`de`|
   * |**Gilbertese**|`gil`|
   * |**Goan Konkani**|`gom`|
   * |**Gondi**|`gon`|
   * |**Gurung**|`gvr`|
   * |**Haitian**|`ht`|
   * |**Halbi**|`hlb`|
   * |**Hani**|`hni`|
   * |**Haryanvi**|`bgc`|
   * |**Hawaiian**|`haw`|
   * |**Hindi**|`hi`|
   * |**Hmong Daw**|`mww`|
   * |**Ho**|`hoc`|
   * |**Hungarian**|`hu`|
   * |**Icelandic**|`is`|
   * |**Inari Sami**|`smn`|
   * |**Indonesian**|`id`|
   * |**Ingush**|`inh`|
   * |**Interlingua (International Auxiliary Language Association)**|`ia`|
   * |**Inuktitut**|`iu`|
   * |**Irish**|`ga`|
   * |**Italian**|`it`|
   * |**Japanese**|`ja`|
   * |**Jaunsari**|`jns`|
   * |**Javanese**|`jv`|
   * |**K'iche'**|`quc`|
   * |**Kabardian**|`kbd`|
   * |**Kabuverdianu**|`kea`|
   * |**Kachin**|`kac`|
   * |**Kalaallisut**|`kl`|
   * |**Kangri**|`xnr`|
   * |**Kara-Kalpak**|`kaa`|
   * |**Karachay-Balkar**|`krc`|
   * |**Kashubian**|`csb`|
   * |**Kazakh**|`kk`|
   * |**Khaling**|`klr`|
   * |**Khasi**|`kha`|
   * |**Kirghiz**|`ky`|
   * |**Korean**|`ko`|
   * |**Korku**|`kfq`|
   * |**Koryak**|`kpy`|
   * |**Kosraean**|`kos`|
   * |**Kumarbhag Paharia**|`kmj`|
   * |**Kumyk**|`kum`|
   * |**Kurdish**|`ku`|
   * |**Kurukh**|`kru`|
   * |**Kölsch**|`ksh`|
   * |**Lak**|`lbe`|
   * |**Lakota**|`lkt`|
   * |**Latin**|`la`|
   * |**Latvian**|`lv`|
   * |**Lezghian**|`lez`|
   * |**Lithuanian**|`lt`|
   * |**Lower Sorbian**|`dsb`|
   * |**Lule Sami**|`smj`|
   * |**Luxembourgish**|`lb`|
   * |**Mahasu Pahari**|`bfz`|
   * |**Maithili**|`mai`|
   * |**Malay (macrolanguage)**|`ms`|
   * |**Maltese**|`mt`|
   * |**Manx**|`gv`|
   * |**Maori**|`mi`|
   * |**Marathi**|`mr`|
   * |**Marshallese**|`mh`|
   * |**Mongolian**|`mn`|
   * |**Montenegrin**|`cnr`|
   * |**Neapolitan**|`nap`|
   * |**Nepali (macrolanguage)**|`ne`|
   * |**Newari**|`new`|
   * |**Niuean**|`niu`|
   * |**Nogai**|`nog`|
   * |**Northern Sami**|`se`|
   * |**Norwegian**|`no`|
   * |**Occitan (post 1500)**|`oc`|
   * |**Old English (ca. 450-1100)**|`ang`|
   * |**Ossetian**|`os`|
   * |**Pali**|`pi`|
   * |**Panjabi**|`pa`|
   * |**Persian**|`fa`|
   * |**Polish**|`pl`|
   * |**Portuguese**|`pt`|
   * |**Pushto**|`ps`|
   * |**Romanian**|`ro`|
   * |**Romansh**|`rm`|
   * |**Russian**|`ru`|
   * |**Sadri**|`sck`|
   * |**Samoan**|`sm`|
   * |**Sanskrit**|`sa`|
   * |**Santali**|`sat`|
   * |**Scots**|`sco`|
   * |**Scottish Gaelic**|`gd`|
   * |**Serbian**|`sr`|
   * |**Sherpa**|`xsr`|
   * |**Sirmauri**|`srx`|
   * |**Skolt Sami**|`sms`|
   * |**Slovak**|`sk`|
   * |**Slovenian**|`sl`|
   * |**Somali**|`so`|
   * |**Southern Sami**|`sma`|
   * |**Spanish**|`es`|
   * |**Swahili (macrolanguage)**|`sw`|
   * |**Swedish**|`sv`|
   * |**Tabassaran**|`tab`|
   * |**Tagalog**|`tl`|
   * |**Tajik**|`tg`|
   * |**Tatar**|`tt`|
   * |**Tetum**|`tet`|
   * |**Thangmi**|`thf`|
   * |**Tonga (Tonga Islands)**|`to`|
   * |**Turkish**|`tr`|
   * |**Turkmen**|`tk`|
   * |**Tuvinian**|`tyv`|
   * |**Uighur**|`ug`|
   * |**Ukrainian**|`uk`|
   * |**Upper Sorbian**|`hsb`|
   * |**Urdu**|`ur`|
   * |**Uzbek**|`uz`|
   * |**Vietnamese**|`vi`|
   * |**Volapük**|`vo`|
   * |**Walser**|`wae`|
   * |**Welsh**|`cy`|
   * |**Western Frisian**|`fy`|
   * |**Yucateco**|`yua`|
   * |**Zhuang**|`za`|
   * |**Zulu**|`zu`|
   *
   * </details><details><summary>Supported Detailed Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Auto detection**|`auto-detect`|
   * |**Arabic (Pseudo-Accents)**|`ar-XA`|
   * |**Belarusian**|`be-cyrl`|
   * |**Belarusian (Latin)**|`be-latn`|
   * |**Chinese (China)**|`zh-CN`|
   * |**Chinese (Simplified)**|`zh-Hans`|
   * |**Chinese (Taiwan)**|`zh-TW`|
   * |**Chinese (Traditional)**|`zh-Hant`|
   * |**Danish (Denmark)**|`da-DK`|
   * |**Dutch (Netherlands)**|`nl-NL`|
   * |**English (United States)**|`en-US`|
   * |**Finnish (Finland)**|`fi-FI`|
   * |**French (France)**|`fr-FR`|
   * |**German (Germany)**|`de-DE`|
   * |**Hungarian (Hungary)**|`hu-HU`|
   * |**Italian (Italy)**|`it-IT`|
   * |**Japanese (Japan)**|`ja-JP`|
   * |**Kara-Kalpak (Cyrillic)**|`kaa-Cyrl`|
   * |**Kazakh**|`kk-cyrl`|
   * |**Kazakh (Latin)**|`kk-latn`|
   * |**Korean (South Korea)**|`ko-KR`|
   * |**Kurdish (Arabic)**|`ku-arab`|
   * |**Kurdish (Latin)**|`ku-latn`|
   * |**Polish**|`pl-PO`|
   * |**Portuguese (Portugal)**|`pt-PT`|
   * |**Region: Czechia**|`cz-CZ`|
   * |**Region: Greece**|`gr-GR`|
   * |**Russian (Russia)**|`ru-RU`|
   * |**Serbian (Cyrillic, Montenegro)**|`sr-Cyrl-ME`|
   * |**Serbian (Latin)**|`sr-latn`|
   * |**Serbian (Latin, Montenegro)**|`sr-Latn-ME`|
   * |**Spanish (Spain)**|`es-ES`|
   * |**Swedish (Sweden)**|`sv-SE`|
   * |**Turkish (Türkiye)**|`tr-TR`|
   * |**Uzbek (Arabic)**|`uz-arab`|
   * |**Uzbek (Cyrillic)**|`uz-cyrl`|
   *
   * </details>
   *
   * @summary OCR
   * @throws FetchError<400, types.OcrOcrCreateResponse400>
   * @throws FetchError<403, types.OcrOcrCreateResponse403>
   * @throws FetchError<404, types.OcrOcrCreateResponse404>
   * @throws FetchError<500, types.OcrOcrCreateResponse500>
   */
  ocr_ocr_create(body: types.OcrOcrCreateBodyParam): Promise<FetchResponse<200, types.OcrOcrCreateResponse200>> {
    return this.core.fetch('/ocr/ocr', 'post', body);
  }

  /**
   * Get a list of all jobs launched for this feature. You'll then be able to use the ID of
   * each one to get its status and results.<br>
   *                             Please note that a **job status doesn't get updated until a
   * get request** is sent.
   *
   * @summary Ocr Async List Job
   */
  ocr_ocr_async_retrieve(): Promise<FetchResponse<200, types.OcrOcrAsyncRetrieveResponse200>> {
    return this.core.fetch('/ocr/ocr_async', 'get');
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**amazon**|`boto3 (v1.15.18)`|1.5 (per 1000 page)|1 page
   * |**microsoft**|`rest API 4.0 (2024-02-29-preview)`|10.0 (per 1000 page)|1 page
   *
   *
   * </details>
   *
   *
   *
   * @summary Ocr Async Launch Job
   */
  ocr_ocr_async_create(body: types.OcrOcrAsyncCreateBodyParam): Promise<FetchResponse<200, types.OcrOcrAsyncCreateResponse200>> {
    return this.core.fetch('/ocr/ocr_async', 'post', body);
  }

  /**
   * Generic class to handle method GET all async job for user
   *
   * Attributes:
   *     feature (str): EdenAI feature
   *     subfeature (str): EdenAI subfeature
   *
   * @summary Ocr Async delete Jobs
   */
  ocr_ocr_async_destroy(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/ocr/ocr_async', 'delete');
  }

  /**
   * Get the status and results of an async job given its ID.
   *
   * @summary Ocr Async Get Job Results
   * @throws FetchError<400, types.OcrOcrAsyncRetrieve2Response400>
   * @throws FetchError<403, types.OcrOcrAsyncRetrieve2Response403>
   * @throws FetchError<404, types.OcrOcrAsyncRetrieve2Response404>
   * @throws FetchError<500, types.OcrOcrAsyncRetrieve2Response500>
   */
  ocr_ocr_async_retrieve_2(metadata: types.OcrOcrAsyncRetrieve2MetadataParam): Promise<FetchResponse<200, types.OcrOcrAsyncRetrieve2Response200>> {
    return this.core.fetch('/ocr/ocr_async/{public_id}', 'get', metadata);
  }

  /**
   * Get a list of all jobs launched for this feature. You'll then be able to use the ID of
   * each one to get its status and results.<br>
   *                             Please note that a **job status doesn't get updated until a
   * get request** is sent.
   *
   * @summary OCR Tables List Job
   */
  ocr_ocr_tables_async_retrieve(): Promise<FetchResponse<200, types.OcrOcrTablesAsyncRetrieveResponse200>> {
    return this.core.fetch('/ocr/ocr_tables_async', 'get');
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**amazon**|`boto3 (v1.15.18)`|15.0 (per 1000 page)|1 page
   * |**google**|`DocumentAI v1 beta3`|65.0 (per 1000 page)|1 page
   * |**microsoft**|`rest API 4.0 (2024-02-29-preview)`|10.0 (per 1000 page)|1 page
   *
   *
   * </details>
   *
   * <details><summary>Supported Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Afrikaans**|`af`|
   * |**Albanian**|`sq`|
   * |**Angika**|`anp`|
   * |**Arabic**|`ar`|
   * |**Asturian**|`ast`|
   * |**Awadhi**|`awa`|
   * |**Azerbaijani**|`az`|
   * |**Bagheli**|`bfy`|
   * |**Basque**|`eu`|
   * |**Belarusian**|`be`|
   * |**Bhojpuri**|`bho`|
   * |**Bislama**|`bi`|
   * |**Bodo (India)**|`brx`|
   * |**Bosnian**|`bs`|
   * |**Braj**|`bra`|
   * |**Breton**|`br`|
   * |**Bulgarian**|`bg`|
   * |**Bundeli**|`bns`|
   * |**Buriat**|`bua`|
   * |**Camling**|`rab`|
   * |**Catalan**|`ca`|
   * |**Cebuano**|`ceb`|
   * |**Chamorro**|`ch`|
   * |**Chhattisgarhi**|`hne`|
   * |**Chinese**|`zh`|
   * |**Cornish**|`kw`|
   * |**Corsican**|`co`|
   * |**Crimean Tatar**|`crh`|
   * |**Croatian**|`hr`|
   * |**Czech**|`cs`|
   * |**Danish**|`da`|
   * |**Dari**|`prs`|
   * |**Dhimal**|`dhi`|
   * |**Dogri (macrolanguage)**|`doi`|
   * |**Dutch**|`nl`|
   * |**English**|`en`|
   * |**Erzya**|`myv`|
   * |**Estonian**|`et`|
   * |**Faroese**|`fo`|
   * |**Fijian**|`fj`|
   * |**Filipino**|`fil`|
   * |**Finnish**|`fi`|
   * |**French**|`fr`|
   * |**Friulian**|`fur`|
   * |**Gagauz**|`gag`|
   * |**Galician**|`gl`|
   * |**German**|`de`|
   * |**Gilbertese**|`gil`|
   * |**Gondi**|`gon`|
   * |**Gurung**|`gvr`|
   * |**Haitian**|`ht`|
   * |**Halbi**|`hlb`|
   * |**Hani**|`hni`|
   * |**Haryanvi**|`bgc`|
   * |**Hawaiian**|`haw`|
   * |**Hindi**|`hi`|
   * |**Hmong Daw**|`mww`|
   * |**Ho**|`hoc`|
   * |**Hungarian**|`hu`|
   * |**Icelandic**|`is`|
   * |**Inari Sami**|`smn`|
   * |**Indonesian**|`id`|
   * |**Interlingua (International Auxiliary Language Association)**|`ia`|
   * |**Inuktitut**|`iu`|
   * |**Irish**|`ga`|
   * |**Italian**|`it`|
   * |**Japanese**|`ja`|
   * |**Jaunsari**|`jns`|
   * |**Javanese**|`jv`|
   * |**K'iche'**|`quc`|
   * |**Kabuverdianu**|`kea`|
   * |**Kachin**|`kac`|
   * |**Kalaallisut**|`kl`|
   * |**Kangri**|`xnr`|
   * |**Kara-Kalpak**|`kaa`|
   * |**Karachay-Balkar**|`krc`|
   * |**Kashubian**|`csb`|
   * |**Kazakh**|`kk`|
   * |**Khaling**|`klr`|
   * |**Khasi**|`kha`|
   * |**Kirghiz**|`ky`|
   * |**Korean**|`ko`|
   * |**Korku**|`kfq`|
   * |**Koryak**|`kpy`|
   * |**Kosraean**|`kos`|
   * |**Kumarbhag Paharia**|`kmj`|
   * |**Kumyk**|`kum`|
   * |**Kurdish**|`ku`|
   * |**Kurukh**|`kru`|
   * |**Kölsch**|`ksh`|
   * |**Lakota**|`lkt`|
   * |**Latin**|`la`|
   * |**Latvian**|`lv`|
   * |**Lithuanian**|`lt`|
   * |**Lower Sorbian**|`dsb`|
   * |**Lule Sami**|`smj`|
   * |**Luxembourgish**|`lb`|
   * |**Mahasu Pahari**|`bfz`|
   * |**Malay (macrolanguage)**|`ms`|
   * |**Maltese**|`mt`|
   * |**Manx**|`gv`|
   * |**Maori**|`mi`|
   * |**Marathi**|`mr`|
   * |**Mongolian**|`mn`|
   * |**Montenegrin**|`cnr`|
   * |**Neapolitan**|`nap`|
   * |**Nepali (macrolanguage)**|`ne`|
   * |**Niuean**|`niu`|
   * |**Nogai**|`nog`|
   * |**Northern Sami**|`se`|
   * |**Norwegian**|`no`|
   * |**Occitan (post 1500)**|`oc`|
   * |**Ossetian**|`os`|
   * |**Panjabi**|`pa`|
   * |**Persian**|`fa`|
   * |**Polish**|`pl`|
   * |**Portuguese**|`pt`|
   * |**Pushto**|`ps`|
   * |**Romanian**|`ro`|
   * |**Romansh**|`rm`|
   * |**Russian**|`ru`|
   * |**Sadri**|`sck`|
   * |**Samoan**|`sm`|
   * |**Sanskrit**|`sa`|
   * |**Santali**|`sat`|
   * |**Scots**|`sco`|
   * |**Scottish Gaelic**|`gd`|
   * |**Serbian**|`sr`|
   * |**Sherpa**|`xsr`|
   * |**Sirmauri**|`srx`|
   * |**Skolt Sami**|`sms`|
   * |**Slovak**|`sk`|
   * |**Slovenian**|`sl`|
   * |**Somali**|`so`|
   * |**Southern Sami**|`sma`|
   * |**Spanish**|`es`|
   * |**Swahili (macrolanguage)**|`sw`|
   * |**Swedish**|`sv`|
   * |**Tagalog**|`tl`|
   * |**Tajik**|`tg`|
   * |**Tatar**|`tt`|
   * |**Tetum**|`tet`|
   * |**Thangmi**|`thf`|
   * |**Tonga (Tonga Islands)**|`to`|
   * |**Turkish**|`tr`|
   * |**Turkmen**|`tk`|
   * |**Tuvinian**|`tyv`|
   * |**Uighur**|`ug`|
   * |**Upper Sorbian**|`hsb`|
   * |**Urdu**|`ur`|
   * |**Uzbek**|`uz`|
   * |**Vietnamese**|`vi`|
   * |**Volapük**|`vo`|
   * |**Walser**|`wae`|
   * |**Welsh**|`cy`|
   * |**Western Frisian**|`fy`|
   * |**Yucateco**|`yua`|
   * |**Zhuang**|`za`|
   * |**Zulu**|`zu`|
   *
   * </details><details><summary>Supported Detailed Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Auto detection**|`auto-detect`|
   * |**Belarusian**|`be-Cyrl`|
   * |**Belarusian (Latin)**|`be-Latn`|
   * |**Chinese (Simplified)**|`zh-Hans`|
   * |**Chinese (Traditional)**|`zh-Hant`|
   * |**Kara-Kalpak (Cyrillic)**|`kaa-Cyrl`|
   * |**Kazakh**|`kk-Cyrl`|
   * |**Kazakh (Latin)**|`kk-Latn`|
   * |**Kurdish (Arabic)**|`ku-Arab`|
   * |**Kurdish (Latin)**|`ku-Latn`|
   * |**Serbian (Cyrillic)**|`sr-Cyrl`|
   * |**Serbian (Cyrillic, Montenegro)**|`sr-Cyrl-ME`|
   * |**Serbian (Latin)**|`sr-Latn`|
   * |**Serbian (Latin, Montenegro)**|`sr-Latn-ME`|
   * |**Uzbek (Arabic)**|`uz-Arab`|
   * |**Uzbek (Cyrillic)**|`uz-cyrl`|
   *
   * </details>
   *
   * @summary OCR Tables Launch Job
   */
  ocr_ocr_tables_async_create(body: types.OcrOcrTablesAsyncCreateBodyParam): Promise<FetchResponse<200, types.OcrOcrTablesAsyncCreateResponse200>> {
    return this.core.fetch('/ocr/ocr_tables_async', 'post', body);
  }

  /**
   * Generic class to handle method GET all async job for user
   *
   * Attributes:
   *     feature (str): EdenAI feature
   *     subfeature (str): EdenAI subfeature
   *
   * @summary OCR Tables delete Jobs
   */
  ocr_ocr_tables_async_destroy(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/ocr/ocr_tables_async', 'delete');
  }

  /**
   * Get the status and results of an async job given its ID.
   *
   * @summary OCR Tables Get Job Results
   * @throws FetchError<400, types.OcrOcrTablesAsyncRetrieve2Response400>
   * @throws FetchError<403, types.OcrOcrTablesAsyncRetrieve2Response403>
   * @throws FetchError<404, types.OcrOcrTablesAsyncRetrieve2Response404>
   * @throws FetchError<500, types.OcrOcrTablesAsyncRetrieve2Response500>
   */
  ocr_ocr_tables_async_retrieve_2(metadata: types.OcrOcrTablesAsyncRetrieve2MetadataParam): Promise<FetchResponse<200, types.OcrOcrTablesAsyncRetrieve2Response200>> {
    return this.core.fetch('/ocr/ocr_tables_async/{public_id}', 'get', metadata);
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**base64**|`latest`|0.25 (per 1 page)|1 page
   * |**microsoft**|`rest API 4.0 (2024-02-29-preview)`|0.01 (per 1 page)|1 page
   * |**mindee**|`v2`|0.1 (per 1 page)|1 page
   * |**tabscanner**|`latest`|0.08 (per 1 page)|1 page
   * |**google**|`DocumentAI v1 beta3`|0.01 (per 1 page)|10 page
   * |**klippa**|`v1`|0.1 (per 1 file)|1 file
   * |**veryfi**|`v8`|0.08 (per 1 file)|1 file
   * |**amazon**|`boto3 1.26.8`|0.01 (per 1 page)|1 page
   * |**affinda**|`v3`|0.07 (per 1 file)|1 file
   * |**eagledoc**|`v3`|0.03 (per 1 page)|1 page
   *
   *
   * </details>
   *
   * <details><summary>Supported Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Afrikaans**|`af`|
   * |**Albanian**|`sq`|
   * |**Arabic**|`ar`|
   * |**Bengali**|`bn`|
   * |**Bulgarian**|`bg`|
   * |**Catalan**|`ca`|
   * |**Chinese**|`zh`|
   * |**Croatian**|`hr`|
   * |**Czech**|`cs`|
   * |**Danish**|`da`|
   * |**Dutch**|`nl`|
   * |**English**|`en`|
   * |**Estonian**|`et`|
   * |**Finnish**|`fi`|
   * |**French**|`fr`|
   * |**German**|`de`|
   * |**Gujarati**|`gu`|
   * |**Hebrew**|`he`|
   * |**Hindi**|`hi`|
   * |**Hungarian**|`hu`|
   * |**Indonesian**|`id`|
   * |**Italian**|`it`|
   * |**Japanese**|`ja`|
   * |**Kannada**|`kn`|
   * |**Korean**|`ko`|
   * |**Latvian**|`lv`|
   * |**Lithuanian**|`lt`|
   * |**Macedonian**|`mk`|
   * |**Malayalam**|`ml`|
   * |**Marathi**|`mr`|
   * |**Modern Greek (1453-)**|`el`|
   * |**Nepali (macrolanguage)**|`ne`|
   * |**Norwegian**|`no`|
   * |**Panjabi**|`pa`|
   * |**Persian**|`fa`|
   * |**Polish**|`pl`|
   * |**Portuguese**|`pt`|
   * |**Romanian**|`ro`|
   * |**Russian**|`ru`|
   * |**Slovak**|`sk`|
   * |**Slovenian**|`sl`|
   * |**Somali**|`so`|
   * |**Spanish**|`es`|
   * |**Swahili (macrolanguage)**|`sw`|
   * |**Swedish**|`sv`|
   * |**Tagalog**|`tl`|
   * |**Tamil**|`ta`|
   * |**Telugu**|`te`|
   * |**Thai**|`th`|
   * |**Turkish**|`tr`|
   * |**Ukrainian**|`uk`|
   * |**Urdu**|`ur`|
   * |**Vietnamese**|`vi`|
   *
   * </details><details><summary>Supported Detailed Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Auto detection**|`auto-detect`|
   * |**Catalan (Spain)**|`ca-ES`|
   * |**Chinese (China)**|`zh-cn`|
   * |**Chinese (Taiwan)**|`zh-tw`|
   * |**Danish (Denmark)**|`da-DK`|
   * |**Dutch (Netherlands)**|`nl-NL`|
   * |**English (United Kingdom)**|`en-GB`|
   * |**English (United States)**|`en-US`|
   * |**French (Canada)**|`fr-CA`|
   * |**French (France)**|`fr-FR`|
   * |**French (Switzerland)**|`fr-CH`|
   * |**German (Germany)**|`de-DE`|
   * |**German (Switzerland)**|`de-CH`|
   * |**Italian (Italy)**|`it-IT`|
   * |**Italian (Switzerland)**|`it-CH`|
   * |**Portuguese (Portugal)**|`pt-PT`|
   * |**Spanish (Spain)**|`es-ES`|
   *
   * </details><strong style='color:red;'>**Note:**</strong> This feature is likely to be
   * deprecated in future releases. It is recommended to use the `financial_parser` feature
   * as an alternative.
   *
   * @summary Receipt Parser
   * @throws FetchError<400, types.OcrReceiptParserCreateResponse400>
   * @throws FetchError<403, types.OcrReceiptParserCreateResponse403>
   * @throws FetchError<404, types.OcrReceiptParserCreateResponse404>
   * @throws FetchError<500, types.OcrReceiptParserCreateResponse500>
   */
  ocr_receipt_parser_create(body: types.OcrReceiptParserCreateBodyParam): Promise<FetchResponse<200, types.OcrReceiptParserCreateResponse200>> {
    return this.core.fetch('/ocr/receipt_parser', 'post', body);
  }

  /**
   * <details><summary><strong style='color: #0072a3; cursor: pointer'>Available
   * Providers</strong></summary>
   *
   *
   *
   * |Provider|Version|Price|Billing unit|
   * |----|-------|-----|------------|
   * |**affinda**|`v3`|0.07 (per 1 file)|1 file
   * |**hireability**|`hireability 1.0.0`|0.05 (per 1 file)|1 file
   * |**klippa**|`v1`|0.1 (per 1 file)|1 file
   * |**senseloaf**|`v3`|0.045 (per 1 file)|1 file
   * |**extracta**|`v1`|0.1 (per 1 page)|1 page
   * |**openai**|`v1.0`|15.0 (per 1000000 token)|1 token
   *
   *
   * </details>
   *
   * <details><summary>Supported Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Afrikaans**|`af`|
   * |**Albanian**|`sq`|
   * |**Amharic**|`am`|
   * |**Arabic**|`ar`|
   * |**Armenian**|`hy`|
   * |**Azerbaijani**|`az`|
   * |**Basque**|`eu`|
   * |**Belarusian**|`be`|
   * |**Bengali**|`bn`|
   * |**Bosnian**|`bs`|
   * |**Bulgarian**|`bg`|
   * |**Burmese**|`my`|
   * |**Catalan**|`ca`|
   * |**Cebuano**|`ceb`|
   * |**Chinese**|`zh`|
   * |**Corsican**|`co`|
   * |**Croatian**|`hr`|
   * |**Czech**|`cs`|
   * |**Danish**|`da`|
   * |**Dutch**|`nl`|
   * |**English**|`en`|
   * |**Esperanto**|`eo`|
   * |**Estonian**|`et`|
   * |**Finnish**|`fi`|
   * |**French**|`fr`|
   * |**Galician**|`gl`|
   * |**Georgian**|`ka`|
   * |**German**|`de`|
   * |**Gujarati**|`gu`|
   * |**Haitian**|`ht`|
   * |**Hausa**|`ha`|
   * |**Hawaiian**|`haw`|
   * |**Hebrew**|`he`|
   * |**Hindi**|`hi`|
   * |**Hmong**|`hmn`|
   * |**Hungarian**|`hu`|
   * |**Icelandic**|`is`|
   * |**Igbo**|`ig`|
   * |**Indonesian**|`id`|
   * |**Irish**|`ga`|
   * |**Italian**|`it`|
   * |**Japanese**|`ja`|
   * |**Javanese**|`jv`|
   * |**Kannada**|`kn`|
   * |**Kazakh**|`kk`|
   * |**Khmer**|`km`|
   * |**Kinyarwanda**|`rw`|
   * |**Kirghiz**|`ky`|
   * |**Korean**|`ko`|
   * |**Kurdish**|`ku`|
   * |**Lao**|`lo`|
   * |**Latin**|`la`|
   * |**Latvian**|`lv`|
   * |**Lithuanian**|`lt`|
   * |**Luxembourgish**|`lb`|
   * |**Macedonian**|`mk`|
   * |**Malagasy**|`mg`|
   * |**Malay (macrolanguage)**|`ms`|
   * |**Malayalam**|`ml`|
   * |**Maltese**|`mt`|
   * |**Maori**|`mi`|
   * |**Marathi**|`mr`|
   * |**Modern Greek (1453-)**|`el`|
   * |**Mongolian**|`mn`|
   * |**Nepali (macrolanguage)**|`ne`|
   * |**Norwegian**|`no`|
   * |**Nyanja**|`ny`|
   * |**Oriya (macrolanguage)**|`or`|
   * |**Panjabi**|`pa`|
   * |**Persian**|`fa`|
   * |**Polish**|`pl`|
   * |**Portuguese**|`pt`|
   * |**Pushto**|`ps`|
   * |**Romanian**|`ro`|
   * |**Russian**|`ru`|
   * |**Samoan**|`sm`|
   * |**Scottish Gaelic**|`gd`|
   * |**Serbian**|`sr`|
   * |**Shona**|`sn`|
   * |**Sindhi**|`sd`|
   * |**Sinhala**|`si`|
   * |**Slovak**|`sk`|
   * |**Slovenian**|`sl`|
   * |**Somali**|`so`|
   * |**Southern Sotho**|`st`|
   * |**Spanish**|`es`|
   * |**Sundanese**|`su`|
   * |**Swahili (macrolanguage)**|`sw`|
   * |**Swedish**|`sv`|
   * |**Tagalog**|`tl`|
   * |**Tajik**|`tg`|
   * |**Tamil**|`ta`|
   * |**Tatar**|`tt`|
   * |**Telugu**|`te`|
   * |**Thai**|`th`|
   * |**Turkish**|`tr`|
   * |**Turkmen**|`tk`|
   * |**Uighur**|`ug`|
   * |**Ukrainian**|`uk`|
   * |**Urdu**|`ur`|
   * |**Uzbek**|`uz`|
   * |**Vietnamese**|`vi`|
   * |**Welsh**|`cy`|
   * |**Western Frisian**|`fy`|
   * |**Xhosa**|`xh`|
   * |**Yiddish**|`yi`|
   * |**Yoruba**|`yo`|
   * |**Zulu**|`zu`|
   *
   * </details><details><summary>Supported Detailed Languages</summary>
   *
   *
   *
   *
   *
   * |Name|Value|
   * |----|-----|
   * |**Auto detection**|`auto-detect`|
   * |**Chinese (China)**|`zh-CN`|
   * |**Chinese (China)**|`zh-cn`|
   * |**Chinese (Taiwan)**|`zh-TW`|
   * |**Chinese (Taiwan)**|`zh-tw`|
   *
   * </details>
   *
   * @summary Resume Parser
   * @throws FetchError<400, types.OcrResumeParserCreateResponse400>
   * @throws FetchError<403, types.OcrResumeParserCreateResponse403>
   * @throws FetchError<404, types.OcrResumeParserCreateResponse404>
   * @throws FetchError<500, types.OcrResumeParserCreateResponse500>
   */
  ocr_resume_parser_create(body: types.OcrResumeParserCreateBodyParam): Promise<FetchResponse<200, types.OcrResumeParserCreateResponse200>> {
    return this.core.fetch('/ocr/resume_parser', 'post', body);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { OcrAnonymizationAsyncCreateBodyParam, OcrAnonymizationAsyncCreateResponse200, OcrAnonymizationAsyncRetrieve2MetadataParam, OcrAnonymizationAsyncRetrieve2Response200, OcrAnonymizationAsyncRetrieve2Response400, OcrAnonymizationAsyncRetrieve2Response403, OcrAnonymizationAsyncRetrieve2Response404, OcrAnonymizationAsyncRetrieve2Response500, OcrAnonymizationAsyncRetrieveResponse200, OcrBankCheckParsingCreateBodyParam, OcrBankCheckParsingCreateResponse200, OcrBankCheckParsingCreateResponse400, OcrBankCheckParsingCreateResponse403, OcrBankCheckParsingCreateResponse404, OcrBankCheckParsingCreateResponse500, OcrCustomDocumentParsingAsyncCreateBodyParam, OcrCustomDocumentParsingAsyncCreateResponse200, OcrCustomDocumentParsingAsyncRetrieve2MetadataParam, OcrCustomDocumentParsingAsyncRetrieve2Response200, OcrCustomDocumentParsingAsyncRetrieve2Response400, OcrCustomDocumentParsingAsyncRetrieve2Response403, OcrCustomDocumentParsingAsyncRetrieve2Response404, OcrCustomDocumentParsingAsyncRetrieve2Response500, OcrCustomDocumentParsingAsyncRetrieveResponse200, OcrDataExtractionCreateBodyParam, OcrDataExtractionCreateResponse200, OcrDataExtractionCreateResponse400, OcrDataExtractionCreateResponse403, OcrDataExtractionCreateResponse404, OcrDataExtractionCreateResponse500, OcrFinancialParserCreateBodyParam, OcrFinancialParserCreateResponse200, OcrFinancialParserCreateResponse400, OcrFinancialParserCreateResponse403, OcrFinancialParserCreateResponse404, OcrFinancialParserCreateResponse500, OcrIdentityParserCreateBodyParam, OcrIdentityParserCreateResponse200, OcrIdentityParserCreateResponse400, OcrIdentityParserCreateResponse403, OcrIdentityParserCreateResponse404, OcrIdentityParserCreateResponse500, OcrInvoiceParserCreateBodyParam, OcrInvoiceParserCreateResponse200, OcrInvoiceParserCreateResponse400, OcrInvoiceParserCreateResponse403, OcrInvoiceParserCreateResponse404, OcrInvoiceParserCreateResponse500, OcrInvoiceSplitterAsyncCreateBodyParam, OcrInvoiceSplitterAsyncCreateResponse200, OcrInvoiceSplitterAsyncRetrieve2MetadataParam, OcrInvoiceSplitterAsyncRetrieve2Response200, OcrInvoiceSplitterAsyncRetrieve2Response400, OcrInvoiceSplitterAsyncRetrieve2Response403, OcrInvoiceSplitterAsyncRetrieve2Response404, OcrInvoiceSplitterAsyncRetrieve2Response500, OcrInvoiceSplitterAsyncRetrieveResponse200, OcrOcrAsyncCreateBodyParam, OcrOcrAsyncCreateResponse200, OcrOcrAsyncRetrieve2MetadataParam, OcrOcrAsyncRetrieve2Response200, OcrOcrAsyncRetrieve2Response400, OcrOcrAsyncRetrieve2Response403, OcrOcrAsyncRetrieve2Response404, OcrOcrAsyncRetrieve2Response500, OcrOcrAsyncRetrieveResponse200, OcrOcrCreateBodyParam, OcrOcrCreateResponse200, OcrOcrCreateResponse400, OcrOcrCreateResponse403, OcrOcrCreateResponse404, OcrOcrCreateResponse500, OcrOcrTablesAsyncCreateBodyParam, OcrOcrTablesAsyncCreateResponse200, OcrOcrTablesAsyncRetrieve2MetadataParam, OcrOcrTablesAsyncRetrieve2Response200, OcrOcrTablesAsyncRetrieve2Response400, OcrOcrTablesAsyncRetrieve2Response403, OcrOcrTablesAsyncRetrieve2Response404, OcrOcrTablesAsyncRetrieve2Response500, OcrOcrTablesAsyncRetrieveResponse200, OcrReceiptParserCreateBodyParam, OcrReceiptParserCreateResponse200, OcrReceiptParserCreateResponse400, OcrReceiptParserCreateResponse403, OcrReceiptParserCreateResponse404, OcrReceiptParserCreateResponse500, OcrResumeParserCreateBodyParam, OcrResumeParserCreateResponse200, OcrResumeParserCreateResponse400, OcrResumeParserCreateResponse403, OcrResumeParserCreateResponse404, OcrResumeParserCreateResponse500 } from './types';
