import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResDataDto } from '../DTO/res-data.dto';
import { ResPaginationDataDto } from '../utils/pagination/dto/res-pagination-data.dto';

export const ApiOkResponseData = <DataDto extends Type<unknown>>(
  dataDto: DataDto | [DataDto],
  isPagination = false,
) =>
  applyDecorators(
    ApiExtraModels(
      ResDataDto,
      ...(Array.isArray(dataDto) ? dataDto : [dataDto]),
      ...(isPagination ? [ResPaginationDataDto] : []),
    ),
    ApiOkResponse({
      schema: !isPagination
        ? {
            allOf: [
              { $ref: getSchemaPath(ResDataDto) },
              {
                properties: {
                  data: Array.isArray(dataDto)
                    ? {
                        type: 'array',
                        items: {
                          oneOf: dataDto.map((item) => ({
                            $ref: getSchemaPath(item),
                          })),
                        },
                      }
                    : { $ref: getSchemaPath(dataDto) },
                },
              },
            ],
          }
        : {
            allOf: [
              { $ref: getSchemaPath(ResPaginationDataDto) },
              {
                properties: {
                  datas: {
                    type: 'array',
                    items: {
                      $ref: getSchemaPath(dataDto as DataDto),
                    },
                  },
                },
              },
            ],
          },
    }),
  );
