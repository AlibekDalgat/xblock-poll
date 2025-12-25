from __future__ import absolute_import
import time
import io
import xlwt

from celery import current_app  # pylint: disable=import-error

from lms.djangoapps.instructor_task.models import ReportStore  # pylint: disable=import-error
from opaque_keys.edx.keys import CourseKey, UsageKey  # pylint: disable=import-error
from xmodule.modulestore.django import modulestore  # pylint: disable=import-error


@current_app.task(name='poll.tasks.export_csv_data')
def export_csv_data(block_id, course_id):
    """
    Exports student answers to all supported questions to an XLS file.
    """

    src_block = modulestore().get_item(UsageKey.from_string(block_id))

    start_timestamp = time.time()
    course_key = CourseKey.from_string(course_id)

    filename = src_block.get_filename()

    data = src_block.prepare_data()

    output = io.BytesIO()

    workbook = xlwt.Workbook(encoding='utf-8')
    worksheet = workbook.add_sheet('Results')

    header_style = xlwt.easyxf(
        'font: bold on; align: wrap on, vert top, horiz center;'
        'borders: left thin, right thin, top thin, bottom thin;'
    )

    cell_style = xlwt.easyxf(
        'align: wrap on, vert top, horiz left;'
        'borders: left thin, right thin, top thin, bottom thin;'
    )

    for row_idx, row_data in enumerate(data):
        for col_idx, cell_value in enumerate(row_data):
            if cell_value is None:
                cell_value = ''
            elif not isinstance(cell_value, (str, int, float)):
                cell_value = str(cell_value)

            if row_idx == 0:
                worksheet.write(row_idx, col_idx, cell_value, header_style)
                worksheet.col(col_idx).width = 256 * 20
            else:
                worksheet.write(row_idx, col_idx, cell_value, cell_style)

    workbook.save(output)
    output.seek(0)

    report_store = ReportStore.from_config(config_name='GRADES_DOWNLOAD')
    report_store.store(course_key, filename, output)

    generation_time_s = time.time() - start_timestamp

    return {
        "error": None,
        "report_filename": filename,
        "start_timestamp": start_timestamp,
        "generation_time_s": generation_time_s,
    }
