import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResPaginationDataDto } from 'src/utils/pagination/dto/res-pagination-data.dto';

export const ApiOkResponseDataPaginate = <DataDto extends Type<unknown>>(
  dataDto: DataDto | [DataDto],
) =>
  applyDecorators(
    ApiExtraModels(
      ResPaginationDataDto,
      ...(Array.isArray(dataDto) ? dataDto : [dataDto]),
    ),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResPaginationDataDto) },
          {
            properties: {
              datas: Array.isArray(dataDto)
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
      },
    }),
  );
